# VFI News Banner Image Setup
# Run this script after saving your banner image

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VFI NEWS BANNER IMAGE SETUP" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$targetPath = "c:\Users\and87\Desktop\FINAL PROJECT MODULE 4\vfi-news-banner.png"

Write-Host "Please save your VFI News banner image to:" -ForegroundColor Green
Write-Host "$targetPath`n" -ForegroundColor White

Write-Host "The banner image should be the one with:" -ForegroundColor Yellow
Write-Host "  - Blue background with wave design" -ForegroundColor White
Write-Host "  - Large 'V NEWS' text in green" -ForegroundColor White
Write-Host "  - 'VFI NEWS' text on the left" -ForegroundColor White
Write-Host "  - Shofar imagery on the right`n" -ForegroundColor White

# Check if file exists
if (Test-Path $targetPath) {
    Write-Host "✓ Banner image found!" -ForegroundColor Green
    $file = Get-Item $targetPath
    Write-Host "  File size: $($file.Length) bytes" -ForegroundColor Cyan
    Write-Host "  Modified: $($file.LastWriteTime)`n" -ForegroundColor Cyan
    
    Write-Host "Opening website in browser..." -ForegroundColor Green
    Start-Sleep -Seconds 1
    Start-Process "c:\Users\and87\Desktop\FINAL PROJECT MODULE 4\index.html"
} else {
    Write-Host "✗ Banner image not found yet." -ForegroundColor Red
    Write-Host "`nTo add the image:" -ForegroundColor Yellow
    Write-Host "  1. Right-click the banner image from the chat" -ForegroundColor White
    Write-Host "  2. Select 'Save Image As...'" -ForegroundColor White
    Write-Host "  3. Save as: vfi-news-banner.png" -ForegroundColor White
    Write-Host "  4. Location: c:\Users\and87\Desktop\FINAL PROJECT MODULE 4\" -ForegroundColor White
    Write-Host "  5. Run this script again`n" -ForegroundColor White
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
