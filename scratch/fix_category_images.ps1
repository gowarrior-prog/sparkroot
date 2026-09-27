Add-Type -AssemblyName System.Drawing

function Process-CategoryImage($srcPath, $targetSize = 72.0) {
    Write-Host "Processing $srcPath with target size $targetSize ..."
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $src = [System.Drawing.Bitmap]::FromStream($ms)
    
    # Bounding box of non-background object pixels
    $minX = $src.Width
    $maxX = 0
    $minY = $src.Height
    $maxY = 0

    for ($y = 0; $y -lt $src.Height; $y++) {
        for ($x = 0; $x -lt $src.Width; $x++) {
            $p = $src.GetPixel($x, $y)
            # Check if pixel is foreground (darker than off-white 238)
            if ($p.R -lt 238 -or $p.G -lt 238 -or $p.B -lt 238) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    if ($minX -ge $maxX -or $minY -ge $maxY) {
        $minX = 0; $maxX = $src.Width - 1
        $minY = 0; $maxY = $src.Height - 1
    }

    $objW = [Math]::Max(1, $maxX - $minX + 1)
    $objH = [Math]::Max(1, $maxY - $minY + 1)

    # Target 200x200 square canvas
    $targetCanvas = New-Object System.Drawing.Bitmap(200, 200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($targetCanvas)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Fit object inside ~72px target size inside 200x200 canvas to match all other category icons
    $scale = [Math]::Min($targetSize / $objW, $targetSize / $objH)
    $finalW = [int]($objW * $scale)
    $finalH = [int]($objH * $scale)

    $destX = [int]((200 - $finalW) / 2)
    $destY = [int]((200 - $finalH) / 2)

    # Extract object crop and draw onto canvas
    $cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $objW, $objH)
    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $finalW, $finalH)

    $g.DrawImage($src, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

    # Clean off-white background pixels on the new canvas to pure white
    for ($y = 0; $y -lt 200; $y++) {
        for ($x = 0; $x -lt 200; $x++) {
            $p = $targetCanvas.GetPixel($x, $y)
            if ($p.R -gt 232 -and $p.G -gt 232 -and $p.B -gt 232) {
                $targetCanvas.SetPixel($x, $y, [System.Drawing.Color]::White)
            }
        }
    }

    $src.Dispose()
    $g.Dispose()
    $ms.Dispose()

    # Save to disk as true PNG
    $targetCanvas.Save($srcPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetCanvas.Dispose()
    Write-Host "Successfully processed $srcPath to 200x200 PNG (Inner Object: ${finalW}x${finalH})!"
}

Process-CategoryImage "d:\clne\sparkroot\public\images\categories\electronics.png" 72.0
Process-CategoryImage "d:\clne\sparkroot\public\images\categories\fashion.png" 72.0
Process-CategoryImage "d:\clne\sparkroot\public\images\categories\toys.png" 75.0
