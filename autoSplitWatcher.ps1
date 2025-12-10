$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = ".\pages"
$watcher.Filter = "*.html"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$action = {
    Write-Host "Detected change in $($Event.SourceEventArgs.FullPath)"
    python ".\split_script.py"
}

Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Register-ObjectEvent $watcher Created -Action $action | Out-Null

# Keep the script running
while ($true) { Start-Sleep -Seconds 1 }