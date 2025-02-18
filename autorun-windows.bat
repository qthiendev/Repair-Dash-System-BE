@echo off

set "SCRIPT_DIR=%~dp0"

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~fs0' -Verb RunAs"
    exit /b
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Node.js v22.13.1...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi' -OutFile 'node.msi'}"
    start /wait msiexec /i node.msi /qn
    del node.msi
    echo Node.js installed successfully.
    setx PATH "%PATH%;C:\Program Files\nodejs\" /M
) else (
    echo Node.js is already installed.
)

setlocal
cd /d "%SCRIPT_DIR%"
"C:\Program Files\nodejs\npm" install

echo Setup complete!
pause
