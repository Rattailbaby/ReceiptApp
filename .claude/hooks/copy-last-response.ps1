$j = $input | Out-String | ConvertFrom-Json
$f = $j.transcript_path
if (-not $f -or -not (Test-Path $f)) { exit 0 }
$lines = Get-Content $f -Encoding UTF8
for ($i = $lines.Count - 1; $i -ge 0; $i--) {
  try { $obj = $lines[$i] | ConvertFrom-Json } catch { continue }
  if ($obj.type -eq 'assistant') {
    $parts = $obj.message.content | Where-Object { $_.type -eq 'text' } | ForEach-Object { $_.text }
    if ($parts) {
      $text = $parts -join [Environment]::NewLine
      if ($text.Trim().Length -gt 0) {
        $text | Set-Clipboard
        break
      }
    }
  }
}
