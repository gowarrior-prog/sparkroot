Add-Type -AssemblyName System.Drawing

$dir = "d:\clne\sparkroot\public\images\categories"
$files = Get-ChildItem -Path $dir -Filter "*.png"

foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    
    $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.R -lt 238 -or $p.G -lt 238 -or $p.B -lt 238) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $w = [Math]::Max(0, $maxX - $minX + 1)
    $h = [Math]::Max(0, $maxY - $minY + 1)
    $maxDim = [Math]::Max($w, $h)
    Write-Host "$($file.Name): Object Size = $($w)x$($h) (Max Dimension = $maxDim)"
    $bmp.Dispose()
    $ms.Dispose()
}
