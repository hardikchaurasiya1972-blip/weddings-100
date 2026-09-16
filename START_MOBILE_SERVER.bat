@echo off
title Riwaayat Royale — Mobile Web Server Launcher
cd /d "%~dp0"
echo ===================================================================
echo     RIWAAYAT ROYALE — INSTANT MOBILE PHONE SERVER
echo ===================================================================
echo Starting zero-dependency local server on your Wi-Fi network...
echo No Node.js or Python required!
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
