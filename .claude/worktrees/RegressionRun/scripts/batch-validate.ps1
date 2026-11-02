# Batch page-validate runner: runs page-validate.ts for multiple URLs,
# aggregates Allure results into a single combined report.
param(
    [string[]]$Urls,
    [string]$Tag = '@Functional',
    [switch]$Headed,
    [string]$VercelUser = 'bayercorp',
    [string]$VercelPassword = 'beyond2026'
)

$ErrorActionPreference = 'Continue'

$AggregateDir = 'reports/allure/batch-results'
$BatchReportDir = 'reports/allure/batch-report'
$PageResultsDir = 'reports/allure/page-level-results'

# Clean aggregate dir once
if (Test-Path $AggregateDir) { Remove-Item $AggregateDir -Recurse -Force }
New-Item -ItemType Directory -Path $AggregateDir -Force | Out-Null

# Set environment for child runs
$env:PAGE_GREP = $Tag
$env:VERCEL_AUTH_USER = $VercelUser
$env:VERCEL_AUTH_PASSWORD = $VercelPassword
if ($Headed) { $env:HEADED = 'true' } else { $env:HEADED = 'false' }

$summary = @()
$idx = 0

foreach ($url in $Urls) {
    $idx++
    $pageName = ($url -replace 'https?://[^/]+/', '' -replace '/', ' / ').Trim()
    if (-not $pageName) { $pageName = "Page-$idx" }

    Write-Host "`n############################################################" -ForegroundColor Cyan
    Write-Host "## URL $idx of $($Urls.Count): $url" -ForegroundColor Cyan
    Write-Host "############################################################" -ForegroundColor Cyan

    $startTime = Get-Date
    & npx tsx (Join-Path $PSScriptRoot 'page-validate.ts') $url $pageName 2>&1 | Tee-Object -Variable runOutput
    $exitCode = $LASTEXITCODE
    $duration = (Get-Date) - $startTime

    # Copy this run's allure results into aggregate, prefixed with URL index to avoid collisions
    if (Test-Path $PageResultsDir) {
        Get-ChildItem $PageResultsDir -File | ForEach-Object {
            Copy-Item $_.FullName -Destination (Join-Path $AggregateDir "url${idx}-$($_.Name)") -Force
        }
    }

    $summary += [PSCustomObject]@{
        Index    = $idx
        Url      = $url
        ExitCode = $exitCode
        Duration = "{0:mm}m{0:ss}s" -f $duration
    }
}

# Generate combined Allure report
Write-Host "`n############################################################" -ForegroundColor Green
Write-Host "## GENERATING COMBINED ALLURE REPORT" -ForegroundColor Green
Write-Host "############################################################" -ForegroundColor Green
& npx allure generate $AggregateDir --clean -o $BatchReportDir

Write-Host "`n========== BATCH SUMMARY ==========" -ForegroundColor Yellow
$summary | Format-Table -AutoSize

# Aggregate per-test stats from JSON
$results = Get-ChildItem "$AggregateDir/*-result.json" | ForEach-Object { Get-Content $_ -Raw | ConvertFrom-Json }
if ($results) {
    Write-Host "`n========== PER-TEST STATUS ==========" -ForegroundColor Yellow
    $results | Group-Object status | ForEach-Object { Write-Host "$($_.Name): $($_.Count)" }
    Write-Host "`nTotal tests executed: $($results.Count)"
}

Write-Host "`n[OK] Combined report: $BatchReportDir/index.html" -ForegroundColor Green
Write-Host "Open with: npx allure open $BatchReportDir --port 5252" -ForegroundColor Green
