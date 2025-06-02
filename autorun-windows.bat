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
    echo %RED%WSL is not installed. Please install before next step!%RESET%
    pause
) else (
    echo %GREEN%WSL is already installed.%RESET%
    echo:
    wsl which redis-server >nul 2>&1
    if %errorLevel% neq 0 (
        echo %RED%Redis is not installed in WSL.%RESET%
    ) else (
        echo %GREEN%Redis is already installed.%RESET%
        wsl pgrep redis-server >nul 2>&1
        if %errorLevel% neq 0 (
            echo %RED%Redis is not running.%RESET%
        ) else (
            echo %GREEN%Redis is already running.%RESET%
        )
    )
)


set "MYSQL_BIN="
for /d %%D in ("C:\Program Files\MySQL\MySQL Server *") do set "MYSQL_BIN=%%D\bin"

setlocal
cd /d "%SCRIPT_DIR%"
echo:
if not defined MYSQL_BIN (
    echo %RED%MySQL 9.2.0 is not installed. Please install before next step!%RESET%.
    pause
) else (
    for /f "tokens=5 delims= " %%V in ('"%MYSQL_BIN%\mysql" --version 2^>nul') do set "MYSQL_VERSION=%%V"
    echo %GREEN%MySQL installed version: %MYSQL_VERSION%%RESET%
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
)

echo:
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%Node.js v22.13.1 not installed.  Please install before next step!%RESET%
    pause
) else (
    echo %GREEN%Node.js is already installed.%RESET%
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
)

pause
