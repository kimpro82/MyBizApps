# Calculate the Total Number and Size of Files by Extension in All Subdirectories 2
# 2024.03.21


# Get all files in subdirectories
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.DirectoryName -ne (Get-Location).Path }

# Group files by extension and calculate count and total size
$groupedFiles = $files | Group-Object Extension | 
Select-Object @{Name='Extension';Expression={$_.Name -replace '^\.', ''}}, 
              @{Name='FileCount';Expression={$_.Count}}, 
              @{Name='TotalSize (Bytes)';Expression={$_.Group | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum}}

# Sort by total size in descending order
$sortedFiles = $groupedFiles | Sort-Object 'TotalSize (Bytes)' -Descending

# Convert the sorted files to a string and trim the trailing newlines
$sortedFilesString = $sortedFiles | Format-Table -AutoSize | Out-String -Width 4096
$sortedFilesString = $sortedFilesString.Trim()

# Output the trimmed string
Write-Host $sortedFilesString

# Calculate total count and total size
$totalCount = ($sortedFiles | Measure-Object -Property FileCount -Sum).Sum
$totalSize = ($sortedFiles | Measure-Object -Property 'TotalSize (Bytes)' -Sum).Sum

# Create a custom object to align the total summary with the table columns
$totalSummary = New-Object PSObject -Property @{
    Extension = 'Total'
    FileCount = $totalCount
    'TotalSize (Bytes)' = $totalSize
}

# Convert the total summary to a string and remove empty lines
$totalSummaryString = $totalSummary | Format-Table -Property Extension, FileCount, 'TotalSize (Bytes)' -HideTableHeaders | Out-String -Width 4096
$totalSummaryString = $totalSummaryString.Trim()

# Output the total summary without extra line breaks
Write-Host "--------- --------- -----------------"
Write-Host $totalSummaryString
