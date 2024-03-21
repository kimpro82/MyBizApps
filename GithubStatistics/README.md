# [Github Statistics](/README.md#-github-statistics)

Manufacture *Github* user statistics by its REST API and crawling


### \<List>

- [Shell : Calculate the Total Number and Size of Files by Extension in All Subdirectories 2 (1) (2024.03.21)](#shell--calculate-the-total-number-and-size-of-files-by-extension-in-all-subdirectories-2-1-20240321)
- [Shell : Calculate the Total Number and Size of Files by Extension in All Subdirectories (2024.03.19)](#shell--calculate-the-total-number-and-size-of-files-by-extension-in-all-subdirectories-20240319)
- [Python : Get Daily Contribution Data by Crawling (2023.12.31)](#python--get-daily-contribution-data-by-crawling-20231231)
- [TypeScript : List a User's Repositories (2023.10.26)](#typescript--list-a-users-repositories-20231026)
- [Google Sheet : Most Used Languages (2023.10.25)](#google-sheet--most-used-languages-20231025)
- [Google Sheet : Dashboard Outline (2020.04.19)](#google-sheet--dashboard-outline-20200419)



## [Shell : Calculate the Total Number and Size of Files by Extension in All Subdirectories 2 (1) (2024.03.21)](#list)

- Implement in 2 scripting languages: Bash and PowerShell
- Improvements
  - Calculate the summation
  - Sort by the total size
- Code and Results
  - `CalcTotalSizeByExtension2.sh`
    <details>
      <summary>Code</summary>

    ```sh
    # Initialize associative arrays for counting files and summing sizes
    declare -A file_counts
    declare -A file_sizes

    # Process each file in subdirectories
    while IFS= read -r -d '' file; do
        ext="${file##*.}"
        size=$(stat -c%s "$file")
        ((file_counts[$ext]++))
        ((file_sizes[$ext]+=$size))
    done < <(find . -mindepth 2 -type f -print0)

    # Initialize variables for total count and size
    total_count=0
    total_size=0

    # Print the header with left-aligned extension names and right-aligned numbers
    printf "%-9s %10s %17s\n" "Extension" "FileCount" "TotalSize(Bytes)"
    printf '=%.0s' {1..38}
    echo ""

    # Use process substitution to sort the output
    while read -r line; do
        echo "$line"
        read -r ext count size <<< "$line"
        ((total_count += count))
        ((total_size += size))
    done < <(for ext in "${!file_counts[@]}"; do
        count=${file_counts[$ext]}
        size=${file_sizes[$ext]}
        printf "%-9s %10d %17d\n" "$ext" "$count" "$size"
    done | sort -k3 -nr)

    # Print dashed line before total
    printf '=%.0s' {1..38}
    echo ""
    # Output total count and size with right-aligned numbers
    printf "%-9s %10d %17d\n" total ${total_count} ${total_size}
    ```
    </details>
    <details open="">
      <summary>Console Output</summary>

      ```sh
      Extension  FileCount  TotalSize(Bytes)
      ======================================
      ini                1               345
      json               1               102
      txt                2                88
      ======================================
      total              4               535
      ```
    </details>
  - `CalcTotalSizeByExtension2.ps1`
    <details>
      <summary>Code</summary>

    ```ps1
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
    ```
    </details>
    <details open="">
      <summary>Console Output</summary>

      ```ps1
      Extension FileCount TotalSize (Bytes)
      --------- --------- -----------------
      ini               1               345
      json              1               102
      txt               2                88
      --------- --------- -----------------
      Total             4               535
      ```
    </details>


## [Shell : Calculate the Total Number and Size of Files by Extension in All Subdirectories (2024.03.19)](#list)

- Implement in 4 scripting languages: Bash, Batchfile, VBScript, PowerShell
- Future Improvements
  - Calculate the summation
  - Sort by the total size
- Code and Results
  - `CalcTotalSizeByExtension.sh`
    <details>
      <summary>Code</summary>

    ```sh
    find */ -type f | awk -F'.' '{print $NF}' | sort | uniq -c | while read count ext; do 
      size=$(find */ -type f -name "*.$ext" -exec du -b {} + | awk '{total+=$1} END {print total}')
      echo "$ext $count $size"
    done
    ```
    </details>
    <details open="">
      <summary>Console Output</summary>

      ```sh
      ini 1 345
      json 1 102
      txt 2 88
      ```
    </details>
  - `CalcTotalSizeByExtension.bat`
    <details>
      <summary>Code</summary>

    ```bat
    @echo off
    setlocal enabledelayedexpansion

    :: Set the directory to search
    set "search_dir=%~dp0"

    :: Temporary file
    set "temp_file=%TEMP%\temp.txt"

    :: Get list of files and their sizes in subdirectories only
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
    ```
    </details>
    <details open="">
      <summary>Console Output</summary>

      ```bat
      json  1 102
      ini  1 345
      txt  2 88
      ```
    </details>
  - `CalcTotalSizeByExtension.vbs`
    <details>
      <summary>Code</summary>

    ```vbs
    Set dict = CreateObject("Scripting.Dictionary")

    Set fso = CreateObject("Scripting.FileSystemObject")
    Set folder = fso.GetFolder(".")
    Set subFolders = CreateObject("Scripting.Dictionary")

    ' Skip the current folder by starting with its subfolders
    For Each subfolder in folder.SubFolders
        subFolders.Add subfolder.Path, subfolder
    Next

    Do While subFolders.Count > 0
        Set folder = subFolders.Item(subFolders.Keys()(0))
        subFolders.Remove folder.Path
        For Each subfolder in folder.SubFolders
            subFolders.Add subfolder.Path, subfolder
        Next
        For Each file In folder.Files
            ext = fso.GetExtensionName(file)
            If Not dict.Exists(ext) Then
                dict.Add ext, Array(0,0)
            End If
            fileInfo = dict(ext)
            fileInfo(0) = fileInfo(0) + 1
            fileInfo(1) = fileInfo(1) + file.Size
            dict(ext) = fileInfo
        Next
    Loop

    ' Output results to the console
    For Each ext In dict.Keys
        WScript.StdOut.WriteLine ext & " " & dict(ext)(0) & " " & dict(ext)(1)
    Next
    ```
    </details>
    <details open="">
      <summary>Run & Console Output</summary>

      ```vbs
      cscript CalcTotalSizeByExtension.vbs
      ```
      ```vbs
      Microsoft (R) Windows Script Host 버전 5.812
      Copyright (C) Microsoft Corporation. All rights reserved.

      json 1 102
      ini 1 345
      txt 2 88
      ```
    </details>
  - `CalcTotalSizeByExtension.ps1`
    <details>
      <summary>Code</summary>

    ```ps1
    Get-ChildItem -Path . -Recurse -File | Where-Object { $_.DirectoryName -ne (Get-Location).Path } | Group-Object Extension | 
    Select-Object @{Name='Extension';Expression={$_.Name -replace '^\.', ''}}, 
                  @{Name='FileCount';Expression={$_.Count}}, 
                  @{Name='TotalSize (Bytes)';Expression={$_.Group | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum}} | 
    Sort-Object 'TotalSize (Bytes)' -Descending | 
    Format-Table -AutoSize
    ```
    </details>
    <details open="">
      <summary>Console Output</summary>

      ```ps1
      Extension FileCount TotalSize (Bytes)
      --------- --------- -----------------
      ini               1               345
      json              1               102
      txt               2                88
      ```
    </details>


## [Python : Get Daily Contribution Data by Crawling (2023.12.31)](#list)

- Retrieves, scrapes, and saves daily contribution data from a GitHub profile for a specified year
  1. `retrieve_daily_contributions()` scrapes the daily contribution data for a given GitHub user and year.
  2. `save_csv()` saves the collected data as a CSV file.
- Future Improvements
  - Analyze periodic trends
- Target URL to be crawled
  ```url
  https://github.com/{username}
  ```
- Usage
  ```py
  if __name__ == "__main__":
      USERNAME = "{username}"
      contributions_data = retrieve_daily_contributions(username=USERNAME, year={year})
      ……
  ```
- Code and Results
  <details>
    <summary>get_github_daily_contributions.py</summary>

  ```py
  import datetime
  import pytz
  import requests
  from bs4 import BeautifulSoup
  import pandas as pd
  ```
  ```py
  TEST = True
  ```
  ```py
  def retrieve_daily_contributions(username: str, year: int = 0) -> pd.DataFrame:
      """
      Retrieve daily contribution data from a GitHub profile for a specific year.

      Args:
          username (str): GitHub username or ID
          year (int): Year for which contributions are to be retrieved (default: 0 for the current year)

      Returns:
          DataFrame: DataFrame containing the daily contribution data
      """

      # URL 설정
      current_year = datetime.datetime.now().year
      if 2000 < year <= current_year:
          year_str = str(year)
          url = f"https://github.com/{username}?from={year_str}-01-01&to={year_str}-12-31"
      else:
          url = f"https://github.com/{username}"
      if TEST:
          print("URL:", url, "\n")

      daily_contributions = []

      try:
          response = requests.get(url, timeout=3)
          soup = BeautifulSoup(response.text, "html.parser")
          table = soup.find("table", class_="ContributionCalendar-grid js-calendar-graph-table")
          if table:
              td_list = table.select("tbody > tr > td")

              # <td tabindex="0" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-4" style="width: 10px" data-date="2023-01-01" id="contribution-day-component-0-0" data-level="4" role="gridcell" data-view-component="true" class="ContributionCalendar-day"></td>
              # <tool-tip id="tooltip-e4f9e24e-d9ec-4ee3-ad3c-c2265e892038" for="contribution-day-component-0-0" popover="manual" data-direction="n" data-type="label" data-view-component="true" class="sr-only position-absolute">5 contributions on January 1st.</tool-tip>
              # ……

              for td in td_list:
                  if td.name == "td" and "data-date" in td.attrs:
                      data_date = td["data-date"]
                      tooltip = td.find_next_sibling("tool-tip")
                      tooltip_id = ""
                      if tooltip:
                          tooltip_id = tooltip["for"]
                          tooltip_text = tooltip.text.split(' ')[0]
                          num_contributions = int(tooltip_text) if tooltip_text.isdigit() else 0
                      else:
                          num_contributions = 0

                      validation = tooltip_id == td["id"]
                      daily_contributions.append([data_date, num_contributions, validation])

      except requests.RequestException as e:
          print(f"Failed to retrieve data: {e}")
          daily_contributions.append(["Failed", "Failed", "Failed"])

      columns = ["Date", "Contributions", "Validation"]
      df = pd.DataFrame(data=daily_contributions, columns=columns)

      return df
  ```
  ```py
  def save_csv(data_frame, filename="github_daily_contributions"):
      """
      Save DataFrame as a CSV file.

      Args:
          data_frame (DataFrame): DataFrame to be saved
          filename (str): Name of the output file (default: github_daily_contributions)
      """
      seoul_timezone = pytz.timezone('Asia/Seoul')
      timestamp = datetime.datetime.now(seoul_timezone).strftime("%Y%m%d_%H%M%S")
      path = f"Data/{filename}_{timestamp}.csv"
      data_frame.to_csv(path, index=False, encoding='utf-8-sig')
      print("File saved successfully:", path)
  ```
  ```py
  if __name__ == "__main__":
      # Example usage:
      USERNAME = "kimpro82"
      contributions_data = retrieve_daily_contributions(username=USERNAME, year=2023)
      print(contributions_data)

      save_csv(contributions_data)
  ```
  </details>
  <details open="">
    <summary>Console Output</summary>

  ```py
            Date  Contributions  Validation
  0    2023-01-01              5        True
  1    2023-01-08              1        True
  2    2023-01-15              1        True
  3    2023-01-22              4        True
  4    2023-01-29              0        True
  ..          ...            ...         ...
  360  2023-12-02              0        True
  361  2023-12-09              6        True
  362  2023-12-16              2        True
  363  2023-12-23              5        True
  364  2023-12-30              4        True

  [365 rows x 3 columns]
  File saved successfully: Data/github_daily_contributions_20240101_003651.csv
  ```
  </details>


## [TypeScript : List a User's Repositories (2023.10.26)](#list)

- Fetch information about a *GitHub* user's repositories using the *GitHub API* and extracts relevant data
- Future Improvements
  - Also retrieve language statistics for each repository and combine them
  - Display the data using an SVG image
- REST API URL
  ```url
  https://api.github.com/users/{username}/repos
  ```
- Usage
  ```bash
  node GetGithubUserStats.js {username}
  ```
- Code and Results
  <details>
    <summary>GetGithubUserStats.ts</summary>

  ```ts
  import axios from 'axios';
  ```
  ```ts
  /**
   * Fetches the repositories of a GitHub user.
   *
   * @param {string} username - The GitHub username to fetch repositories for.
   * @returns {Promise<any[]>} - A promise that resolves with an array of repositories.
   */
  async function fetchUserRepos(username: string): Promise<any[]> {
      try {
          // GitHub API URL
          const apiUrl = `https://api.github.com/users/${username}/repos`;

          // Send a GET request to the GitHub API
          const response = await axios.get(apiUrl);

          // Check if the request was successful
          if (response.status === 200) {
              return response.data; // Array of repositories
          } else {
              throw new Error('Failed to fetch user repositories.');
          }
      } catch (error) {
          console.error('Error:', error.message);
          return [];
      }
  }
  ```
  ```ts
  /**
   * Extracts relevant information from GitHub repositories.
   *
   * @param {any[]} repos - An array of GitHub repositories.
   * @returns {any[]} - An array of extracted information.
   */
  function extractRepoInfo(repos: any[]): any[] {
      const extractedData = repos.map((repo) => ({
          name: repo.name,
          isPrivate: repo.private, // 'private' is a reserved word in strict mode
          fork: repo.fork,
          size: repo.size,
          language: repo.language,
      }));

      return extractedData;
  }
  ```
  ```ts
  // Check if the script is run directly using Node.js
  if (require.main === module) {
      const username = process.argv[2]; // process.argv[0] is the Node.js path, process.argv[1] is the current script file path
      if (!username) {
          console.error('Please provide a username.');
          process.exit(1);
      }

      fetchUserRepos(username)
          .then((repos) => {
              const extractedInfo = extractRepoInfo(repos);
              console.table(extractedInfo);
          })
          .catch((err) => {
              console.error(err);
          });
  }
  ```
  </details>
  <details open="">
    <summary>Console Output</summary>

  ```ts
  ┌─────────┬───────────────────────┬───────────┬───────┬───────┬────────────────────┐
  │ (index) │         name          │ isPrivate │ fork  │ size  │      language      │
  ├─────────┼───────────────────────┼───────────┼───────┼───────┼────────────────────┤
  │    0    │  'Coursera_Capstone'  │   false   │ false │   1   │ 'Jupyter Notebook' │
  │    1    │ 'github-readme-stats' │   false   │ true  │ 3406  │        null        │
  │    2    │   'GodSaveTheQueen'   │   false   │ false │ 2190  │      'Python'      │
  │    3    │      'kimpro82'       │   false   │ false │  83   │        null        │
  │    4    │       'MOOCoke'       │   false   │ false │  74   │        null        │
  │    5    │    'MyAIPractice'     │   false   │ false │ 4955  │        'R'         │
  │    6    │      'MyBizApps'      │   false   │ false │ 1036  │       'VBA'        │
  │    7    │   'MyCodingContest'   │   false   │ false │  430  │       'C++'        │
  │    8    │    'MyFamilyCare'     │   false   │ false │ 8128  │       'VBA'        │
  │    9    │       'MyGame'        │   false   │ false │ 2597  │       'VBA'        │
  │   10    │ 'MyInvestmentModules' │   false   │ false │ 1172  │       'VBA'        │
  │   11    │     'MyPractice'      │   false   │ false │ 21271 │       'VBA'        │
  │   12    │    'MyWebPractice'    │   false   │ false │  408  │    'JavaScript'    │
  │   13    │ 'PhantomOfTheLibrary' │   false   │ false │  89   │      'Python'      │
  └─────────┴───────────────────────┴───────────┴───────┴───────┴────────────────────┘
  ```
  </details>


## [Google Sheet : Most Used Languages (2023.10.25)](#list)

- Manually produce statistics of an user's most used languages in Github  
  ☞ [Link on Google Sheet](https://docs.google.com/spreadsheets/d/11xVkJTgdPQGpMBumih58aiuZ62kejE_EZHUKJ8sLGWw/edit?usp=sharing)
- Future Improvement
  - Update automatically with Github REST API
    ```url
    https://api.github.com/repos/{username}/{repo}/languages
    ```

  ![Most Used Languages](./Images/Github_Most_Used_Languages.png)


## [Google Sheet : Dashboard Outline (2020.04.19)](#list)

- ~~A blueprint for~~ a dashboard to manage Github contributions using Github API  
  ☞ [Link on Google Sheet](https://docs.google.com/spreadsheets/d/1sAs7gI6XTFCzPPCxwryew0eV-0sE_hHjab5yzo3t3Mw/edit?usp=sharing)
- Future Improvement
  - ~~Update automatically with Github REST API~~ (Enough to operate manually)

  ![Github Contribution Goal](./Images/Github_Contribution_Goal.png)
