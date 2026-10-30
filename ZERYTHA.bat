@echo off
title ZERYTHA OS
cd /d "%~dp0"
start "ZERYTHA SERVER" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
timeout /t 2 /nobreak >nul
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%a
set IP=%IP: =%
start "" "http://localhost:8123/"
echo.
echo ZERYTHA OS baslatildi: http://localhost:8123/
echo Telefondan erisim: http://%IP%:8123/
echo Sunucuyu durdurmak icin "ZERYTHA SERVER" penceresini kapatin.
pause