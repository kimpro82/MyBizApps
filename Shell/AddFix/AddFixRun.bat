@REM Run AddFix.vbs
@REM 2023.10.30

cscript AddFix.vbs .txt prefix pf_ test
@REM cscript AddFix.vbs .txt suffix _sf
cscript AddFix.vbs .txt replace pf_ " " test
