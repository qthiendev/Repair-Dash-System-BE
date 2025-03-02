@echo off

set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "RESET=[0m"

set "SCRIPT_DIR=%~dp0"

echo %CYAN%Starting setup...%RESET%

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~fs0' -Verb RunAs"
    exit /b
)

echo:
wsl --status >nul 2>&1
if %errorLevel% neq 0 (
    echo %RED%WSL is not installed.%RESET%
    set /p INSTALL_WSL="%YELLOW%Do you want to install WSL? (y/n): %RESET%"
    if /I "%INSTALL_WSL%"=="y" (
        echo %GREEN%Installing WSL...%RESET%
        echo wsl --install
        wsl --install
        echo %YELLOW%Please restart your computer after WSL installation.%RESET%
        exit /b
    ) else (
        echo %RED%WSL is required for Redis. Exiting...%RESET%
        exit /b 1
    )
) else (
    echo %GREEN%WSL is already installed.%RESET%
    echo %GREEN%Updateing WSL...%RESET%
    echo wsl sudo apt update
    wsl sudo apt update
    echo sudo apt upgrade -y
    wsl sudo apt upgrade -y
    echo wsl sudo apt-get update
    wsl sudo apt update
    echo wsl sudo apt-get upgrade -y
    wsl sudo apt upgrade -y
)

echo:
wsl which redis-server >nul 2>&1
if %errorLevel% neq 0 (
    echo %RED%Redis is not installed in WSL.%RESET%
    set /p INSTALL_REDIS="%YELLOW%Do you want to install Redis in WSL? (y/n): %RESET%"
    if /I "%INSTALL_REDIS%"=="y" (
        echo %GREEN%Installing Redis...%RESET%
        echo wsl sudo apt-get update && wsl sudo apt-get install -y redis-server
        wsl sudo apt-get install -y redis-server
        echo %GREEN%Redis installed successfully in WSL.%RESET%
    ) else (
        echo %RED%Redis is required for authentication. Exiting...%RESET%
        exit /b 1
    )
) else (
    echo %GREEN%Redis is already installed.%RESET%
)

echo:
wsl pgrep redis-server >nul 2>&1
if %errorLevel% neq 0 (
    echo %RED%Redis is not running. Starting Redis...%RESET%
    echo wsl sudo service redis-server start
    wsl sudo service redis-server start
    echo %GREEN%Redis started successfully.%RESET%
) else (
    echo %GREEN%Redis is already running.%RESET%
    echo:
    set /p RESTART_REDIS="%YELLOW%Do you want to restart Redis? (y/n): %RESET%"
    if /I "%RESTART_REDIS%"=="y" (
        echo %BLUE%Restarting Redis...%RESET%
        echo sudo service redis-server restart
        wsl sudo service redis-server restart
        echo %GREEN%Redis restarted successfully.%RESET%
    ) else (
        echo %CYAN%Redis will continue running.%RESET%
    )
)

echo:
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo %YELLOW%Installing Node.js v22.13.1...%RESET%
    echo powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi' -OutFile 'node.msi'}"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi' -OutFile 'node.msi'}"
    start /wait msiexec /i node.msi /qn
    del node.msi
    echo %GREEN%Node.js installed successfully.%RESET%
    echo:
    setx PATH "%PATH%;C:\Program Files\nodejs\" /M
    echo setx PATH "%PATH%;C:\Program Files\nodejs\" /M
    echo %GREEN%Node.js set in variable path.%RESET%
) else (
    echo %GREEN%Node.js is already installed.%RESET%
)

set "MYSQL_BIN="
for /d %%D in ("C:\Program Files\MySQL\MySQL Server *") do set "MYSQL_BIN=%%D\bin"

echo:
if not defined MYSQL_BIN (
    echo MySQL is not installed. Installing MySQL 9.2.0...
    echo powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQL-9.2.0/mysql-9.2.0-winx64.msi' -OutFile 'mysql.msi'}"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQL-9.2.0/mysql-9.2.0-winx64.msi' -OutFile 'mysql.msi'}"
    start /wait msiexec /i mysql.msi /qn
    del mysql.msi
    echo MySQL 9.2.0 installed successfully.
    set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 9.2\bin"
    echo:
    setx PATH "%PATH%;%MYSQL_BIN%" /M
    echo setx PATH "%PATH%;%MYSQL_BIN%" /M
    echo %GREEN%MySQL set in variable path.%RESET%
) else (
    for /f "tokens=5 delims= " %%V in ('"%MYSQL_BIN%\mysql" --version 2^>nul') do set "MYSQL_VERSION=%%V"
    echo %GREEN%MySQL installed version: %MYSQL_VERSION%%RESET%
    
    if "%MYSQL_VERSION%" LSS "9.2.0" (
        echo %CYAN%Recommended version: 9.2.0 for better performance and security.%RESET%
    ) else (
        echo %CYAN%Your MySQL version is up to date.%RESET%
    )
)

set "MYSQL_CMD=%MYSQL_BIN%\mysql"

echo:
setlocal
cd /d "%SCRIPT_DIR%"
echo %BLUE%Installing dependencies...%RESET%
echo CMD /C "C:\Program Files\nodejs\npm" i --loglevel error
CMD /C "C:\Program Files\nodejs\npm" i --loglevel error
echo:
echo %GREEN%Dependencies installed successfully.%RESET%

echo:

if exist .env (
    echo %GREEN%.env already exists. Skipping copy.%RESET%
) else (
    echo %BLUE%Copying .env.example to .env...%RESET%
    copy /Y .env.example .env

    if exist .env (
        echo %GREEN%Successfully copied .env.example to .env.%RESET%
    ) else (
        echo %RED%ERROR: Failed to copy .env.example to .env!%RESET%
        echo %CYAN%Please copy the file manually using: copy .env.example .env%RESET%
        exit /b 1
    )
)

echo:

set /p MIGRATE="%YELLOW%Do you want to migrate the database? (y/n): %RESET%"
if /I "%MIGRATE%"=="y" (
    echo %BLUE%Running migrate...%RESET%
    echo "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\migrations\250302-rddb.migration.sql"
    "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\migrations\250302-rddb.migration.sql"
    if %errorlevel% neq 0 (
        echo %RED%Error: Database migration failed.%RESET%
    ) else (
        echo %GREEN%Migration completed successfully.%RESET%
    )
) else (
    echo %CYAN%Skipping database migration.%RESET%
)

echo:

set /p SEED="%YELLOW%Do you want to run the database seeder? (y/n): %RESET%"
if /I "%SEED%"=="y" (
    echo %BLUE%Running migrate...%RESET%
    echo "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\seeders\250302-rddb.seeder.sql"
    "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\seeders\250302-rddb.seeder.sql"
    if %errorlevel% neq 0 (
        echo %RED%Error: Database seeder failed.%RESET%
    ) else (
        echo %GREEN%Seeder completed successfully.%RESET%
    )
) else (
    echo %CYAN%Skipping database seeder.%RESET%
)

echo:
set /p RUNSERVER="%YELLOW%Setup complete, do you want to run server? (y/n): %RESET%"
if /I "%RUNSERVER%"=="y" (
    echo %BLUE%Running server...%RESET%
    echo "C:\Program Files\nodejs\npm" run start
    "C:\Program Files\nodejs\npm" run start
    if %errorlevel% neq 0 (
        echo %RED%Error: Failed to start the server.%RESET%
    )
) else (
    echo %CYAN%Skipping server start.%RESET%
)

pause
