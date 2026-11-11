Add-Type -AssemblyName System.Drawing
$frontendRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$publicRoot = Join-Path $frontendRoot 'public'
$catalogPath = Join-Path $publicRoot 'data/regionais.json'
$catalog = Get-Content -LiteralPath $catalogPath -Raw -Encoding UTF8 | ConvertFrom-Json
$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
foreach ($item in $catalog.equipamentos) {
    if (-not $item.foto -or $item.foto -match '-640.jpg$') { continue }
    $sourcePath = [IO.Path]::GetFullPath((Join-Path $publicRoot $item.foto.TrimStart('/')))
    $allowedRoot = [IO.Path]::GetFullPath((Join-Path $publicRoot 'Imagens/regionais')) + [IO.Path]::DirectorySeparatorChar
    if (-not $sourcePath.StartsWith($allowedRoot, [StringComparison]::OrdinalIgnoreCase)) { throw 'Imagem fora do acervo de regionais.' }
    $image = [Drawing.Image]::FromFile($sourcePath)
    $width = [Math]::Min(800, $image.Width)
    $height = [Math]::Max(1, [int]($image.Height * $width / $image.Width))
    $bitmap = [Drawing.Bitmap]::new($width, $height)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.Clear([Drawing.Color]::White)
    $graphics.DrawImage($image, 0, 0, $width, $height)
    $parameters = [Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality, [long]78)
    $item.foto = '/Imagens/regionais/' + $item.id + '-640.jpg'
    $bitmap.Save((Join-Path $publicRoot $item.foto.TrimStart('/')), $codec, $parameters)
    $graphics.Dispose(); $bitmap.Dispose(); $image.Dispose(); $parameters.Dispose()
    # Somente originais importados dentro da pasta verificada acima são removidos.
    Remove-Item -LiteralPath $sourcePath
}
$json = $catalog | ConvertTo-Json -Depth 20
[IO.File]::WriteAllText($catalogPath, $json, [Text.UTF8Encoding]::new($false))
$backendCatalog = Join-Path $frontendRoot '../backend/src/main/resources/regionais/catalogo.json'
[IO.File]::WriteAllText([IO.Path]::GetFullPath($backendCatalog), $json, [Text.UTF8Encoding]::new($false))
