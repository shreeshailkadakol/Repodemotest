#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Run URL redirect validation tests in batches of 50 until all rows are processed
.DESCRIPTION
    This script automatically detects the total number of rows in the Excel file
    and runs tests in batches of 50 rows each until all rows are validated.
#>

$ErrorActionPreference = "Stop"

# Configuration
$ExcelFilePath = ".\test-data\UK-Redirects.xlsx"
$BatchSize = 50
$ConfigFilePath = ".\config\redirectConfig.ts"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL Redirect Batch Validation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Excel file exists
if (-not (Test-Path $ExcelFilePath)) {
    Write-Host "ERROR: Excel file not found at $ExcelFilePath" -ForegroundColor Red
    exit 1
}

# Read Excel to get total row count
Write-Host "Reading Excel file to determine total rows..." -ForegroundColor Yellow

try {
    # Load Excel COM object
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open((Resolve-Path $ExcelFilePath).Path)
    $worksheet = $workbook.Worksheets.Item(1)
    
    # Find last row with data
    $lastRow = $worksheet.UsedRange.Rows.Count
    
    # Close Excel
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($worksheet) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    # Subtract 1 for header row
    $totalDataRows = $lastRow - 1
    
    Write-Host "Total data rows found: $totalDataRows" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "ERROR: Failed to read Excel file: $_" -ForegroundColor Red
    exit 1
}

# Calculate number of batches
$totalBatches = [Math]::Ceiling($totalDataRows / $BatchSize)
Write-Host "Total batches to process: $totalBatches (batch size: $BatchSize)" -ForegroundColor Cyan
Write-Host ""

# Function to update redirectConfig.ts
function Update-RedirectConfig {
    param (
        [int]$StartRow,
        [int]$EndRow
    )
    
    $configContent = Get-Content $ConfigFilePath -Raw
    
    # Update testLimit
    $testLimit = $EndRow - $StartRow + 1
    $configContent = $configContent -replace 'testLimit:\s*\d+,', "testLimit: $testLimit,"
    
    # Update testStartRow
    $configContent = $configContent -replace 'testStartRow:\s*\d+,', "testStartRow: $StartRow,"
    
    # Update testEndRow
    $configContent = $configContent -replace 'testEndRow:\s*\d+,', "testEndRow: $EndRow,"
    
    Set-Content -Path $ConfigFilePath -Value $configContent -NoNewline
}

# Summary variables
$totalPassed = 0
$totalFailed = 0
$batchResults = @()

# Process each batch
for ($batchNum = 1; $batchNum -le $totalBatches; $batchNum++) {
    $startRow = (($batchNum - 1) * $BatchSize) + 1
    $endRow = [Math]::Min($startRow + $BatchSize - 1, $totalDataRows)
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "BATCH $batchNum of $totalBatches" -ForegroundColor Cyan
    Write-Host "Rows: $startRow - $endRow" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Update config file
    Write-Host "Updating configuration..." -ForegroundColor Yellow
    Update-RedirectConfig -StartRow $startRow -EndRow $endRow
    Write-Host "Configuration updated: testStartRow=$startRow, testEndRow=$endRow" -ForegroundColor Green
    Write-Host ""
    
    # Wait a moment for file system
    Start-Sleep -Seconds 1
    
    # Run tests
    Write-Host "Starting test execution..." -ForegroundColor Yellow
    $env:NODE_ENV = 'range'
    
    $testOutput = & npx playwright test tests/specs/urlRedirect.spec.ts --project=chromium 2>&1
    $testExitCode = $LASTEXITCODE
    
    Write-Host ""
    Write-Host "Test execution completed with exit code: $testExitCode" -ForegroundColor $(if ($testExitCode -eq 0) { "Green" } else { "Yellow" })
    Write-Host ""
    
    # Parse results from output (looking for summary)
    $summaryMatch = $testOutput | Select-String -Pattern "Passed Tests:\s*(\d+)" -AllMatches
    $failedMatch = $testOutput | Select-String -Pattern "Failed Tests:\s*(\d+)" -AllMatches
    
    if ($summaryMatch -and $failedMatch) {
        $batchPassed = [int]$summaryMatch.Matches[0].Groups[1].Value
        $batchFailed = [int]$failedMatch.Matches[0].Groups[1].Value
    } else {
        # If summary not found, estimate based on exit code
        $batchPassed = if ($testExitCode -eq 0) { $endRow - $startRow + 1 } else { 0 }
        $batchFailed = if ($testExitCode -eq 0) { 0 } else { $endRow - $startRow + 1 }
    }
    
    $totalPassed += $batchPassed
    $totalFailed += $batchFailed
    
    $batchResults += [PSCustomObject]@{
        Batch = $batchNum
        Rows = "$startRow-$endRow"
        Passed = $batchPassed
        Failed = $batchFailed
        ExitCode = $testExitCode
    }
    
    Write-Host "Batch $batchNum Results: Passed=$batchPassed, Failed=$batchFailed" -ForegroundColor Cyan
    Write-Host ""
    
    # Wait between batches to allow system to stabilize
    if ($batchNum -lt $totalBatches) {
        Write-Host "Waiting 5 seconds before next batch..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

# Final Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "FINAL SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Total Rows Tested: $totalDataRows" -ForegroundColor White
Write-Host "Total Batches: $totalBatches" -ForegroundColor White
Write-Host "Total Passed: $totalPassed" -ForegroundColor Green
Write-Host "Total Failed: $totalFailed" -ForegroundColor $(if ($totalFailed -gt 0) { "Red" } else { "Green" })
Write-Host "Pass Rate: $([Math]::Round(($totalPassed / $totalDataRows) * 100, 2))%" -ForegroundColor $(if ($totalPassed -eq $totalDataRows) { "Green" } else { "Yellow" })
Write-Host ""

Write-Host "Batch Details:" -ForegroundColor Cyan
$batchResults | Format-Table -AutoSize

Write-Host ""
Write-Host "Results saved to: $ExcelFilePath" -ForegroundColor Green
Write-Host ""
Write-Host "Script completed!" -ForegroundColor Green
