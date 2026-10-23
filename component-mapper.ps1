# Component Mapper - Helper Scripts
# Run these commands to use the Component Mapper system

Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         COMPONENT MAPPER - QUICK COMMANDS                 ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

function Show-Menu {
    Write-Host "Choose an option:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. View pages in CSV" -ForegroundColor White
    Write-Host "  2. Validate CSV format" -ForegroundColor White
    Write-Host "  3. Scan pages (from CSV)" -ForegroundColor Green
    Write-Host "  4. Run presence tests (Fast - 5 min)" -ForegroundColor Green
    Write-Host "  5. Run FULL tests (Complete - 20 min)" -ForegroundColor Magenta
    Write-Host "  6. View generated mapping (CSV)" -ForegroundColor White
    Write-Host "  7. Open documentation" -ForegroundColor White
    Write-Host "  8. Fresh scan (clear old data)" -ForegroundColor Yellow
    Write-Host "  0. Exit" -ForegroundColor Red
    Write-Host ""
}

function View-CSVPages {
    Write-Host "`n📋 Reading pages from CSV...`n" -ForegroundColor Cyan
    npx tsx helpers/orchestrator/csvInputReader.ts
    Read-Host "`nPress Enter to continue"
}

function Validate-CSV {
    Write-Host "`n✓ Validating CSV format...`n" -ForegroundColor Cyan
    npx tsx helpers/orchestrator/csvInputReader.ts validate
    Read-Host "`nPress Enter to continue"
}

function Scan-Pages {
    Write-Host "`n🔍 Scanning pages from CSV...`n" -ForegroundColor Green
    npx tsx helpers/orchestrator/pageScanner.ts
    Read-Host "`nPress Enter to continue"
}

function Run-PresenceTests {
    Write-Host "`n⚡ Running component presence tests (FAST)...`n" -ForegroundColor Green
    Write-Host "This will verify components exist on pages (~5 min)`n" -ForegroundColor Gray
    npx playwright test tests/specs/dynamic/page-mapper.spec.ts --project=chromium
    Read-Host "`nPress Enter to continue"
}

function Run-FullTests {
    Write-Host "`n🔬 Running FULL component test suite (COMPREHENSIVE)...`n" -ForegroundColor Magenta
    Write-Host "This will execute ALL test cases for each component (~20 min)`n" -ForegroundColor Gray
    Write-Host "Example: TeaserGrid → ALL teaserGrid.spec.ts tests" -ForegroundColor Gray
    Write-Host "         IndividualTeaser → ALL individualTeaserComponent.spec.ts tests`n" -ForegroundColor Gray
    
    $confirm = Read-Host "Continue? (y/n)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        npx tsx helpers/orchestrator/componentTestRunner.ts chromium
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
    Read-Host "`nPress Enter to continue"
}

function View-GeneratedMapping {
    Write-Host "`n📊 Generated Component Mapping (First 20 lines):`n" -ForegroundColor Cyan
    Get-Content config/page-component-mapping.csv | Select-Object -First 20
    Write-Host "`n📄 Full file: config/page-component-mapping.csv" -ForegroundColor Gray
    Read-Host "`nPress Enter to continue"
}

function Open-Documentation {
    Write-Host "`n📚 Opening documentation...`n" -ForegroundColor Cyan
    Write-Host "Available docs:" -ForegroundColor Yellow
    Write-Host "  1. Quick Reference (START HERE)" -ForegroundColor White
    Write-Host "  2. Full Guide" -ForegroundColor White
    Write-Host "  3. Pipeline Setup" -ForegroundColor White
    Write-Host "  4. Implementation Summary" -ForegroundColor White
    $docChoice = Read-Host "`nChoose (1-4)"
    
    switch ($docChoice) {
        "1" { code docs/COMPONENT-MAPPER-QUICK-REFERENCE.md }
        "2" { code docs/COMPONENT-MAPPER-README.md }
        "3" { code docs/COMPONENT-MAPPER-PIPELINE-GUIDE.md }
        "4" { code docs/IMPLEMENTATION-SUMMARY.md }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
    Read-Host "`nPress Enter to continue"
}

function Fresh-Scan {
    Write-Host "`n🔄 Fresh scan (clearing old data)...`n" -ForegroundColor Yellow
    $confirm = Read-Host "This will delete existing mapping. Continue? (y/n)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        Remove-Item config/page-component-mapping.json -ErrorAction SilentlyContinue
        Write-Host "Old mapping deleted." -ForegroundColor Green
        npx tsx helpers/orchestrator/pageScanner.ts
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
    Read-Host "`nPress Enter to continue"
}

# Main loop
do {
    Clear-Host
    Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         COMPONENT MAPPER - QUICK COMMANDS                 ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
    
    Show-Menu
    $choice = Read-Host "Enter your choice (0-8)"
    
    switch ($choice) {
        "1" { View-CSVPages }
        "2" { Validate-CSV }
        "3" { Scan-Pages }
        "4" { Run-PresenceTests }
        "5" { Run-FullTests }
        "6" { View-GeneratedMapping }
        "7" { Open-Documentation }
        "8" { Fresh-Scan }
        "0" { 
            Write-Host "`n✅ Done! For more help, see docs/COMPONENT-MAPPER-QUICK-REFERENCE.md`n" -ForegroundColor Green
            exit 
        }
        default { 
            Write-Host "`n❌ Invalid choice. Please try again." -ForegroundColor Red
            Read-Host "Press Enter to continue"
        }
    }
} while ($true)
