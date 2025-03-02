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
    echo powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi' -OutFile 'node.msi'}"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi' -OutFile 'node.msi'}"
    start /wait msiexec /i node.msi /qn
    del node.msi
    echo Node.js installed successfully.
    setx PATH "%PATH%;C:\Program Files\nodejs\" /M
) else (
    echo Node.js is already installed.
)

echo:

set "MYSQL_BIN="
for /d %%D in ("C:\Program Files\MySQL\MySQL Server *") do set "MYSQL_BIN=%%D\bin"

if not defined MYSQL_BIN (
    echo MySQL is not installed. Installing MySQL 9.2.0...
    echo powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQL-9.2.0/mysql-9.2.0-winx64.msi' -OutFile 'mysql.msi'}"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = 'TLS12'; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQL-9.2.0/mysql-9.2.0-winx64.msi' -OutFile 'mysql.msi'}"
    start /wait msiexec /i mysql.msi /qn
    del mysql.msi
    echo MySQL 9.2.0 installed successfully.
    set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 9.2\bin"
    setx PATH "%PATH%;%MYSQL_BIN%" /M
    echo MySQL path has been added to the system PATH.
) else (
    for /f "tokens=5 delims= " %%V in ('"%MYSQL_BIN%\mysql" --version 2^>nul') do set "MYSQL_VERSION=%%V"
    echo MySQL installed version: %MYSQL_VERSION%
    
    if "%MYSQL_VERSION%" LSS "9.2.0" (
        echo Recommended version: 9.2.0
        echo Consider updating MySQL to 9.2.0 for better performance and security.
    ) else (
        echo Your MySQL version is up to date.
    )
)

set "MYSQL_CMD=%MYSQL_BIN%\mysql"

echo:

setlocal
cd /d "%SCRIPT_DIR%"
echo Installing dependencies...
echo CMD /C "C:\Program Files\nodejs\npm" i --loglevel error
CMD /C "C:\Program Files\nodejs\npm" i --loglevel error
echo:
echo Dependencies installed successfully.

echo:

if exist .env (
    echo .env already exists. Skipping copy.
) else (
    echo Copying .env.example to .env...
    copy /Y .env.example .env

    if exist .env (
        echo Successfully copied .env.example to .env.
    ) else (
        echo ERROR: Failed to copy .env.example to .env!
        echo Please copy the file manually using: copy .env.example .env
        exit /b 1
    )
)

echo:

set /p MIGRATE="Do you want to migrate the database? (y/n): "
if /I "%MIGRATE%"=="y" (
    echo Running migrate...
    echo "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\migrations\250302-rddb.migration.sql"
    "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\migrations\250302-rddb.migration.sql"
    if %errorlevel% neq 0 (
        echo Error: Database migration failed.
    ) else (
        echo Migration completed successfully.
    )
) else (
    echo Skipping database migration.
)

echo:

set /p SEED="Do you want to run the database seeder? (y/n): "
if /I "%SEED%"=="y" (
    echo Running seeder...
    echo "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\seeders\250302-rddb.seeder.sql"
    "%MYSQL_CMD%" -u root -p < "%SCRIPT_DIR%database\seeders\250302-rddb.seeder.sql"
    if %errorlevel% neq 0 (
        echo Error: Database seeder failed.
    ) else (
        echo Seeder completed successfully.
    )
) else (
    echo Skipping database seeder.
)

echo:

set /p RUNSERVER="Setup complete, do you want to run server? (y/n): "
if /I "%RUNSERVER%"=="y" (
    echo Running server...
    echo "C:\Program Files\nodejs\npm" run start
    "C:\Program Files\nodejs\npm" run start
    if %errorlevel% neq 0 (
        echo Error: Failed to start the server.
    )
) else (
    echo Skipping server start.
)

pause
