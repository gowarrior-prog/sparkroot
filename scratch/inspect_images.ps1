Add-Type -AssemblyName System.Drawing

$dir = "d:\clne\sparkroot\public\images\categories"
$files = Get-ChildItem -Path $dir -Filter "*.png"

foreach ($file in $files) {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
        Write-Host "$($file.Name): Width=$($bmp.Width), Height=$($bmp.Height), RawFormat=$($bmp.RawFormat.Guid)"
        
        # Sample center and corner pixel
        $corner = $bmp.GetPixel(0, 0)
        Write-Host "   Corner Pixel (0,0): R=$($corner.R), G=$($corner.G), B=$($corner.B), A=$($corner.A)"
        $bmp.Dispose()
    } catch {
        Write-Host "Error reading $($file.Name): $_"
    }
}
