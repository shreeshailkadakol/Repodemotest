/**
 * generate-testcase-sheet.ts
 *
 * Writes a real .xlsx test-case sheet in the ADO-import 9-column layout used by
 * the `ado-test-case-generation` skill. The model reasons about the story and
 * produces the rows as JSON; this script only turns that JSON into a binary
 * Excel file (which the model cannot emit directly).
 *
 * Uses the framework's existing `xlsx` (SheetJS) dependency - no new libs.
 *
 * Usage:
 *   npx tsx scripts/generate-testcase-sheet.ts --input <rows.json> --out <path.xlsx> [--sheet "Test Cases"]
 *
 * Input JSON: an array of row objects. The 9 ADO columns are written in a fixed
 * order regardless of key order in the JSON. An optional `testLevel` field
 * ("BE" | "FE") is used ONLY to sort BE cases before FE cases in the single tab;
 * it is not written as a column (the sheet stays at exactly 9 columns for ADO
 * import). Any other extra keys are ignored.
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// The 9 ADO-import columns, in the exact order the skill mandates.
const COLUMNS = [
  'ID',
  'Work Item Type',
  'Title',
  'Test Step',
  'Step Action',
  'Step Expected',
  'Area Path',
  'Assigned To',
  'State',
] as const;

type Column = (typeof COLUMNS)[number];
type Row = Partial<Record<Column, string>> & { testLevel?: 'BE' | 'FE' | string };

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[key] = val;
    }
  }
  return out;
}

function fail(message: string): never {
  console.error(`[generate-testcase-sheet] ERROR: ${message}`);
  process.exit(1);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input;
  const outPath = args.out;
  const sheetName = args.sheet || 'Test Cases';

  if (!inputPath) fail('missing --input <rows.json>');
  if (!outPath) fail('missing --out <path.xlsx>');
  if (!fs.existsSync(inputPath)) fail(`input file not found: ${inputPath}`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  } catch (e) {
    fail(`could not parse input JSON: ${(e as Error).message}`);
  }

  if (!Array.isArray(parsed)) fail('input JSON must be an array of row objects');
  const rows = parsed as Row[];
  if (rows.length === 0) fail('input JSON contains no rows');

  // Stable sort: BE cases first, then FE, then anything unlabeled - preserving
  // the model's ordering within each group.
  const order = (r: Row): number => (r.testLevel === 'BE' ? 0 : r.testLevel === 'FE' ? 1 : 2);
  const sorted = rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => order(a.r) - order(b.r) || a.i - b.i)
    .map((x) => x.r);

  // Project every row onto exactly the 9 columns (missing keys -> empty string).
  const sheetRows = sorted.map((r) => {
    const obj: Record<Column, string> = {} as Record<Column, string>;
    for (const col of COLUMNS) obj[col] = (r[col] ?? '').toString();
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(sheetRows, { header: [...COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const dir = path.dirname(outPath);
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  XLSX.writeFile(workbook, outPath);

  const beCount = sorted.filter((r) => r.testLevel === 'BE').length;
  const feCount = sorted.filter((r) => r.testLevel === 'FE').length;
  console.log(`[generate-testcase-sheet] wrote ${sorted.length} test case(s) to ${outPath}`);
  console.log(
    `[generate-testcase-sheet]   BE: ${beCount}  FE: ${feCount}  other: ${sorted.length - beCount - feCount}`
  );
}

main();
