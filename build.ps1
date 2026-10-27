$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputDir = Join-Path $projectRoot 'dist'
$assetDir = Join-Path $outputDir 'assets'

New-Item -ItemType Directory -Force -Path $assetDir | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot 'index.html'), (Join-Path $projectRoot 'styles.css'), (Join-Path $projectRoot 'script.js'), (Join-Path $projectRoot 'logo.svg'), (Join-Path $projectRoot 'logo-icon.svg'), (Join-Path $projectRoot 'logo-icon-white.svg') -Destination $outputDir -Force
Copy-Item -Path (Join-Path $projectRoot 'assets\*') -Destination $assetDir -Force -Recurse
