:: Calculate the Total Number and Size of Files by Extension in All Subfolders
:: 2024.03.19


@echo off
setlocal enabledelayedexpansion

:: Set the directory to search
set "search_dir=%~dp0"

:: Temporary file
set "temp_file=%TEMP%\temp.txt"

:: Get list of files and their sizes in subfolders only
for /r "%search_dir%" %%F in (*) do (
    if not "%%~dpF"=="%search_dir%" (
        echo %%~zF %%~xF >> "%temp_file%"
    )
)

:: Initialize the last extension variable
set "lastext="

:: Process each file extension
for /f "tokens=1,* delims= " %%A in ('type "%temp_file%" ^| sort /+41') do (
    set "size=%%A"
    set "ext=%%B"
    set "count=1"
    if not "!lastext!"=="!ext!" (
        if not "!lastext!"=="" (
            :: Remove the leading dot from the extension
            set "lastext=!lastext:~1!"
            echo !lastext! !count! !totalsize!
        )
        set "totalsize=0"
        set "count=0"
        set "lastext=!ext!"
    )
    set /a totalsize+=size
    set /a count+=1
)

:: Write the last extension
if not "!lastext!"=="" (
    :: Remove the leading dot from the extension
    set "lastext=!lastext:~1!"
    echo !lastext! !count! !totalsize!
)

:: Clean up
if exist "%temp_file%" del "%temp_file%"

endlocal
