@REM Run AddFix_b.vbs
@REM 2023.10.30 (Adjusted : 2023.11.07)

cscript AddFix_b.vbs .txt prefix pf_
@REM cscript AddFix_b.vbs .txt suffix _sf
cscript AddFix_b.vbs .txt replace pf_ " "
