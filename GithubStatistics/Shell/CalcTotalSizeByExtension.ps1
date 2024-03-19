# Calculate the Total Number and Size of Files by Extension in All Subdirectories
# 2024.03.19

Get-ChildItem -Path . -Recurse -File | Where-Object { $_.DirectoryName -ne (Get-Location).Path } | Group-Object Extension | 
Select-Object @{Name='Extension';Expression={$_.Name -replace '^\.', ''}}, 
              @{Name='FileCount';Expression={$_.Count}}, 
              @{Name='TotalSize (Bytes)';Expression={$_.Group | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum}} | 
Sort-Object 'TotalSize (Bytes)' -Descending | 
Format-Table -AutoSize
