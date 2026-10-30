# ZERYTHA OS — yerel HTTP sunucu (telefonlardan da erişilebilir)
$port = 8123
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $root -or -not (Test-Path $root)) { $root = "C:\Users\CASHMERE\Desktop\DENEME" }

# Port kullanımdaysa eski süreci temizle
try {
  $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    $proc = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -match 'powershell|pwsh') { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
  }
} catch {}

$listener = $null
try {
  $listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any, $port)
  $listener.Start()
} catch {
  Write-Host "SUNUCU BASLATILAMADI: $($_.Exception.Message)"
  Write-Host "Port $port kullanımda olabilir. Eski 'ZERYTHA SERVER' penceresini kapatin."
  Read-Host "Cikmak icin Enter"
  exit 1
}

Write-Host "ZERYTHA OS sunucusu http://0.0.0.0:$port/ adresinde calisiyor"
Write-Host "Bu bilgisayardan: http://localhost:$port/"
try {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127\.' } | Select-Object -First 1).IPAddress
  if ($ip) { Write-Host "Telefondan: http://$ip`:$port/" }
} catch {}
Write-Host "Durdurmak icin Ctrl+C veya pencereyi kapatin."

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".txt"  = "text/plain; charset=utf-8"
}

while ($true) {
  $client = $null
  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) { $client.Close(); continue }
    while ($true) { $h = $reader.ReadLine(); if ($h -eq "" -or $h -eq $null) { break } }

    $parts = $requestLine.Split(" ")
    $path = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
    $path = $path.Split("?")[0]
    if ($path -eq "/") { $path = "/index.html" }
    $decoded = [System.Uri]::UnescapeDataString($path)
    $file = Join-Path $root ($decoded.TrimStart("/").Replace("/", "\"))

    if (Test-Path $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($hb, 0, $hb.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($hb, 0, $hb.Length)
      $stream.Write($body, 0, $body.Length)
    }
    $stream.Flush()
  } catch {
    # sessizce devam
  } finally {
    if ($client) { $client.Close() }
  }
}