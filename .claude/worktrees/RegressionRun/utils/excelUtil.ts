/**
 * Component Mapper - Excel Utility
 * What:
 *   Reads, validates, and updates redirect test data stored in Excel files.
 * Why:
 *   Created to provide a single reusable data access layer for redirect tests
 *   and avoid repeating spreadsheet handling logic in specs.
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { test } from '@playwright/test';

// Column header constants to avoid string literal duplication (SonarQube S1192)
const COLUMN_OLD_URL = 'Old URL';
const COLUMN_REDIRECT_URL = 'Redirect URL';
const COLUMN_ACTUAL_URL = 'Actual URL';
const COLUMN_STATUS = 'Status';
const COLUMN_ERROR_MESSAGE = 'Error Message';
const COLUMN_TEST_TIMESTAMP = 'Test Timestamp';

/**
 * Interface for URL redirect test data
 */
export interface RedirectTestData {
  [COLUMN_OLD_URL]: string;
  [COLUMN_REDIRECT_URL]: string;
  [COLUMN_ACTUAL_URL]?: string;
  Status?: 'PASS' | 'FAIL' | 'PENDING';
  [COLUMN_ERROR_MESSAGE]?: string;
  [COLUMN_TEST_TIMESTAMP]?: string;
}

/**
 * Excel utility class for reading and writing redirect test data
 */
export class ExcelUtil {
  private filePath: string;
  private workbook: XLSX.WorkBook;
  private worksheet: XLSX.WorkSheet;
  private sheetName: string;
  private cached_data: RedirectTestData[] | null = null;
  private cached_limit: number = -1;

  constructor(filePath: string, sheetName: string = 'Sheet1') {
    this.filePath = filePath;
    this.sheetName = sheetName;
    this.loadWorkbook();
  }

  /**
   * Clear cache and reload workbook from disk
   */
  public reloadWorkbook(): void {
    this.cached_data = null;
    this.cached_limit = -1;
    this.loadWorkbook();
    console.log('Excel workbook reloaded from disk, cache cleared');
  }

  /**
   * Load workbook from file and ensure correct column structure
   */
  private loadWorkbook(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        // Force fresh read from disk
        const fileStats = fs.statSync(this.filePath);
        console.log(`Reading Excel file: ${this.filePath}`);
        console.log(`File size: ${fileStats.size} bytes, Modified: ${fileStats.mtime}`);
        
        this.workbook = XLSX.readFile(this.filePath, { cellDates: false, cellText: true });
        this.worksheet = this.workbook.Sheets[this.sheetName];
        
        if (!this.worksheet) {
          throw new Error(`Sheet '${this.sheetName}' not found in Excel file`);
        }
        
        // Ensure the worksheet has the correct column headers
        this.ensureColumnHeaders();
      } else {
        throw new Error(`Excel file not found at: ${this.filePath}`);
      }
    } catch (error) {
      test.step('Excel file loading failed', async () => {
        console.error(`Failed to load Excel file: ${error}`);
        throw error;
      });
    }
  }

  /**
   * Ensure the Excel file has the correct column headers
   */
  private ensureColumnHeaders(): void {
    try {
      // Check existing headers
      const headerRow = XLSX.utils.sheet_to_json(this.worksheet, { header: 1, range: 'A1:Z1' })[0] as string[];
      
      // Define required headers
      const requiredHeaders = [COLUMN_OLD_URL, COLUMN_REDIRECT_URL, COLUMN_ACTUAL_URL, COLUMN_STATUS, COLUMN_ERROR_MESSAGE, COLUMN_TEST_TIMESTAMP];
      
      let needsUpdate = false;
      
      // Add missing headers
      requiredHeaders.forEach((header, index) => {
        const column = String.fromCharCode(65 + index); // A, B, C, D, E, F
        if (!headerRow[index] || headerRow[index] !== header) {
          XLSX.utils.sheet_add_aoa(this.worksheet, [[header]], { origin: `${column}1` });
          needsUpdate = true;
          console.log(`HEADER: Added missing header - ${column}1 = "${header}"`);
        }
      });
      
      if (needsUpdate) {
        // Update the worksheet range to include all columns
        const range = this.worksheet['!ref'];
        if (range) {
          const newRange = range.replace(/[A-Z]+(\d+)$/, 'F$1');
          this.worksheet['!ref'] = newRange;
        }
        
        // Save the updated structure
        this.workbook.Sheets[this.sheetName] = this.worksheet;
        console.log('EXCEL: Column structure updated');
      }
    } catch (error) {
      console.warn(`Warning: Could not verify/update column headers: ${error}`);
    }
  }

  /**
   * Read all redirect test data from Excel
   * @param limit Optional limit for number of rows to read
   * @param startRow Optional starting row (1-based, excluding header)
   * @param endRow Optional ending row (1-based, inclusive)
   * @returns Array of redirect test data
   */
  readRedirectData(limit?: number, startRow?: number, endRow?: number): RedirectTestData[] {
    // Create cache key including all parameters
    const cacheKey = `${limit || 0}_${startRow || 0}_${endRow || 0}`;
    if (this.cached_data && this.cached_limit === (limit || 0) && !startRow && !endRow) {
      return this.cached_data;
    }

    try {
      const jsonData = XLSX.utils.sheet_to_json(this.worksheet) as RedirectTestData[];
      
      // DEBUG: Log first 3 rows to verify Excel content
      console.log('\nEXCEL DATA CHECK - First 3 rows:');
      jsonData.slice(0, 3).forEach((row, index) => {
        console.log(`Row ${index + 1}:`);
        console.log(`  Old URL: ${row[COLUMN_OLD_URL]}`);
        console.log(`  Redirect URL: ${row[COLUMN_REDIRECT_URL]}`);
      });
      console.log('END EXCEL DATA CHECK\n');
      
      // Define home page URL for empty redirects
      const homePageUrl = 'https://www.bayer.co.uk/en-gb/';
      
      // Filter out rows with empty Old URL, but handle empty Redirect URLs
      const validData = jsonData.filter(row => 
        row[COLUMN_OLD_URL] && row[COLUMN_OLD_URL].trim() !== ''
      ).map(row => {
        // If Redirect URL is empty or N/A, set it to home page
        if (!row[COLUMN_REDIRECT_URL] || 
            row[COLUMN_REDIRECT_URL].trim() === '' || 
            row[COLUMN_REDIRECT_URL].trim().toLowerCase() === 'n/a') {
          row[COLUMN_REDIRECT_URL] = homePageUrl;
        }
        return row;
      });

      let result = validData;

      // Apply row range if specified (startRow and endRow are 1-based)
      if (startRow || endRow) {
        const start = startRow ? startRow - 1 : 0; // Convert to 0-based
        const end = endRow ? endRow : validData.length;
        result = validData.slice(start, end);
        console.log(`RANGE: Testing rows ${startRow || 1} to ${Math.min(endRow || validData.length, validData.length)} (${result.length} URLs)`);
      }
      // Apply limit if specified and no range
      else if (limit && limit > 0) {
        result = validData.slice(0, limit);
      }

      // Cache the result only for simple limit queries
      if (!startRow && !endRow) {
        this.cached_data = result;
        this.cached_limit = limit || 0;
      }

      return result;
    } catch (error) {
      console.error(`Failed to read redirect data: ${error}`);
      throw error;
    }
  }

  /**
   * Update a single row in Excel with test results
   * @param rowNumber Actual Excel data row number (1-based, excluding header)
   * @param actualURL The actual redirected URL
   * @param status Test status (PASS/FAIL)
   * @param errorMessage Optional error message if test failed
   */
  updateTestResult(
    rowNumber: number, 
    actualURL: string, 
    status: 'PASS' | 'FAIL', 
    errorMessage?: string
  ): void {
    try {
      // Add 1 to rowNumber to account for header row (convert to Excel row with header)
      const excelRowIndex = rowNumber + 1;
      
      // Update Actual URL column (column C)
      const actualURLCell = `C${excelRowIndex}`;
      XLSX.utils.sheet_add_aoa(this.worksheet, [[actualURL]], { origin: actualURLCell });
      
      // Update Status column (column D)
      const statusCell = `D${excelRowIndex}`;
      XLSX.utils.sheet_add_aoa(this.worksheet, [[status]], { origin: statusCell });
      
      // Update Error Message column (column E) if provided
      if (errorMessage) {
        const errorCell = `E${excelRowIndex}`;
        XLSX.utils.sheet_add_aoa(this.worksheet, [[errorMessage]], { origin: errorCell });
      }
      
      // Update Timestamp column (column F)
      const timestampCell = `F${excelRowIndex}`;
      const timestamp = new Date().toISOString();
      XLSX.utils.sheet_add_aoa(this.worksheet, [[timestamp]], { origin: timestampCell });
      
    } catch (error) {
      console.error(`Failed to update test result for row ${rowIndex}: ${error}`);
      throw error;
    }
  }

  /**
   * Save the updated workbook to file with verification
   */
  saveWorkbook(): void {
    try {
      // Ensure the workbook is properly updated
      this.workbook.Sheets[this.sheetName] = this.worksheet;
      
      // Write the file
      XLSX.writeFile(this.workbook, this.filePath);
      
      // Verify file was written
      if (fs.existsSync(this.filePath)) {
        const stats = fs.statSync(this.filePath);
        console.log(`SUCCESS: Excel file updated successfully - ${this.filePath} (${stats.size} bytes, modified: ${stats.mtime})`);
      } else {
        throw new Error('File was not created after write operation');
      }
    } catch (error) {
      console.error(`Failed to save Excel file: ${error}`);
      // Try alternative path
      try {
        const backupPath = this.filePath.replace('.xlsx', '_backup.xlsx');
        XLSX.writeFile(this.workbook, backupPath);
        console.log(`Backup saved to: ${backupPath}`);
      } catch (backupError) {
        console.error(`Failed to create backup: ${backupError}`);
      }
      throw error;
    }
  }

  /**
   * Get total number of test data rows
   */
  getDataRowCount(): number {
    const jsonData = XLSX.utils.sheet_to_json(this.worksheet);
    return jsonData.filter((row: any) => 
      row[COLUMN_OLD_URL] && row[COLUMN_OLD_URL].trim() !== ''
    ).length;
  }

  /**
   * Clean up result columns before starting new test run
   * Clears Actual URL, Status, Error Message, and Test Timestamp columns
   * @param rowCount Optional number of rows to clean (defaults to all data rows)
   * @param startRow Optional starting row to clean (1-based)
   * @param endRow Optional ending row to clean (1-based, inclusive)
   */
  cleanupResultColumns(rowCount?: number, startRow?: number, endRow?: number): void {
    try {
      let dataCount = rowCount || this.getDataRowCount();
      let actualStartRow = startRow || 1;
      let actualEndRow = endRow || dataCount;
      
      // If row range is specified, calculate the actual rows to clean
      if (startRow && endRow) {
        dataCount = endRow - startRow + 1;
        console.log(`CLEANUP: Cleaning up result columns for rows ${startRow}-${endRow} (${dataCount} rows)...`);
      } else {
        console.log(`CLEANUP: Cleaning up result columns for ${dataCount} test rows...`);
      }
      
      // Clear columns C (Actual URL), D (Status), E (Error Message), F (Test Timestamp)
      for (let i = actualStartRow - 1; i < actualEndRow; i++) {
        const excelRowIndex = i + 2; // Account for header row and 0-based indexing
        
        // Clear Actual URL column (column C)
        const actualURLCell = `C${excelRowIndex}`;
        XLSX.utils.sheet_add_aoa(this.worksheet, [['']], { origin: actualURLCell });
        
        // Clear Status column (column D)  
        const statusCell = `D${excelRowIndex}`;
        XLSX.utils.sheet_add_aoa(this.worksheet, [['']], { origin: statusCell });
        
        // Clear Error Message column (column E)
        const errorCell = `E${excelRowIndex}`;
        XLSX.utils.sheet_add_aoa(this.worksheet, [['']], { origin: errorCell });
        
        // Clear Timestamp column (column F)
        const timestampCell = `F${excelRowIndex}`;
        XLSX.utils.sheet_add_aoa(this.worksheet, [['']], { origin: timestampCell });
      }
      
      // Save the cleaned workbook
      this.saveWorkbook();
      console.log(`SUCCESS: Successfully cleaned ${dataCount} result rows in Excel file`);
      
    } catch (error) {
      console.error(`Failed to cleanup result columns: ${error}`);
      throw error;
    }
  }

  /**
   * Initialize Excel file with headers if it doesn't exist
   * @param filePath Path where to create the Excel file
   */
  static createRedirectTestFile(filePath: string): void {
    const headers = [
      COLUMN_OLD_URL,
      COLUMN_REDIRECT_URL, 
      COLUMN_ACTUAL_URL,
      COLUMN_STATUS,
      COLUMN_ERROR_MESSAGE,
      COLUMN_TEST_TIMESTAMP
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    XLSX.writeFile(workbook, filePath);
    console.log(`Created new redirect test Excel file: ${filePath}`);
  }

  /**
   * Validate Excel file structure
   */
  validateFileStructure(): boolean {
    try {
      const headers = XLSX.utils.sheet_to_json(this.worksheet, { header: 1 })[0] as string[];
      
      const requiredHeaders = [COLUMN_OLD_URL, COLUMN_REDIRECT_URL];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        console.error(`Missing required headers: ${missingHeaders.join(', ')}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to validate file structure: ${error}`);
      return false;
    }
  }
}