@echo off
setlocal EnableDelayedExpansion

@REM Input
set /p file="Enter the file name : "

@REM Set Variables
set chars=0
set words=0
set lines=0

@REM Loop for the each line
for /f "tokens=*" %%l in ('type %file%') do (

    @REM test : ok
    echo %%l

    @REM Count chars : failed
    @REM set /a chars+=1

    @REM Count words
    @REM "delims={space}{tab}" is default
    for %%w in (%%l) do (

        @REM test : ok
        echo %%w

        set /a words+=1
    )

    @REM Count lines
    set /a lines+=1

    @REM test
    echo !chars! !words! !lines!
)

@REM Output
echo Number of characters : %chars%
echo Number of words      : %words%
echo Number of lines      : %lines%