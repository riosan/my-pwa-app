$port = 8080
$appPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $appPath
python -m http.server $port
