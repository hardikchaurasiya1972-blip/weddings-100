param (
    [int]$Port = 8080,
    [switch]$NoBrowser
)

# Set console title safely
try {
    $Host.UI.RawUI.WindowTitle = "Riwaayat Royale - Mobile Server (Port $Port)"
} catch {}

# Discover local LAN / Wi-Fi IP address
$LocalIP = "127.0.0.1"
try {
    $netIPs = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
        Where-Object { 
            $_.IPAddress -notlike "127.*" -and 
            $_.IPAddress -notlike "169.254.*"
        }
    $wifi = $netIPs | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*" } | Select-Object -First 1
    if ($wifi) {
        $LocalIP = $wifi.IPAddress
    } elseif ($netIPs) {
        $LocalIP = ($netIPs | Select-Object -First 1).IPAddress
    }
} catch {
    $LocalIP = "127.0.0.1"
}

$RootDir = $PSScriptRoot
if (-not $RootDir) { $RootDir = (Get-Location).Path }

# MIME mappings
$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".mp4"  = "video/mp4"
}

# Start TCP Listener
$Listener = $null
try {
    $Listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
    $Listener.Start()
} catch {
    $Port = 8081
    $Listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
    $Listener.Start()
}

$MobileUrl = "http://${LocalIP}:${Port}"

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "   RIWAAYAT ROYALE - MOBILE PHONE WEB SERVER" -ForegroundColor DarkYellow
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  SERVER STATUS: ACTIVE & LISTENING" -ForegroundColor Green
Write-Host ""
Write-Host "  Desktop PC URL:     http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  Mobile Phone URL:   $MobileUrl" -ForegroundColor Magenta
Write-Host ""
Write-Host "  1. Connect your phone to the same Wi-Fi network" -ForegroundColor White
Write-Host "  2. Open the camera on your phone and scan the QR code on screen" -ForegroundColor White
Write-Host "     or type $MobileUrl in Safari/Chrome" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  Press Ctrl + C to stop the server anytime." -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) {
    try {
        Start-Process "http://localhost:$Port/mobile-connect.html"
    } catch {}
}

while ($true) {
    try {
        $Client = $Listener.AcceptTcpClient()
        $Stream = $Client.GetStream()
        $Reader = New-Object System.IO.StreamReader($Stream)

        $RequestLine = $Reader.ReadLine()
        if (-not $RequestLine) {
            $Client.Close()
            continue
        }

        # Read remaining headers
        while ($line = $Reader.ReadLine()) {
            if ($line.Trim() -eq "") { break }
        }

        $Parts = $RequestLine.Split(' ')
        $RawUrl = if ($Parts.Length -gt 1) { $Parts[1] } else { "/" }

        $CleanPath = $RawUrl.Split('?')[0].Split('#')[0]
        $DecodedPath = [System.Uri]::UnescapeDataString($CleanPath).TrimStart('/')

        if ($DecodedPath -eq "" -or $DecodedPath -eq "/") {
            $DecodedPath = "index.html"
        }

        $Normalized = $DecodedPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $FilePath = Join-Path $RootDir $Normalized

        if (Test-Path $FilePath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
            $FileBytes = [System.IO.File]::ReadAllBytes($FilePath)

            $Header = "HTTP/1.1 200 OK`r`n" +
                      "Content-Type: $ContentType`r`n" +
                      "Content-Length: $($FileBytes.Length)`r`n" +
                      "Access-Control-Allow-Origin: *`r`n" +
                      "Connection: close`r`n`r`n"

            $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
            $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
            $Stream.Write($FileBytes, 0, $FileBytes.Length)
            $Stream.Flush()
        } else {
            $NotFound = "<html><body><h1>404 Not Found</h1><p>$DecodedPath</p></body></html>"
            $NotFoundBytes = [System.Text.Encoding]::UTF8.GetBytes($NotFound)
            $Header = "HTTP/1.1 404 Not Found`r`n" +
                      "Content-Type: text/html; charset=utf-8`r`n" +
                      "Content-Length: $($NotFoundBytes.Length)`r`n" +
                      "Connection: close`r`n`r`n"
            $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
            $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
            $Stream.Write($NotFoundBytes, 0, $NotFoundBytes.Length)
            $Stream.Flush()
        }

        $Stream.Close()
        $Client.Close()
    } catch {
        # Catch and continue on socket errors
    }
}
