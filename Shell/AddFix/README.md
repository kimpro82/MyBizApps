# [Add Fix (VBScript)](../../README.md#shell)

Add a prefix, suffix, or replace part of file names in a folder


### \<List>

- [Add Fix - b (2023.11.07)](#add-fix---b-20231107)
- [Add Fix (2023.10.30)](#add-fix-20231030)
- [Add Prefix (2023.10.17)](#add-prefix-20231017)



## [Add Fix - b (2023.11.07)](#list)

- Refactoring : Improvement of conditional branching for `prefix` `suffix` `replace`
- Codes and Results
  <details>
    <summary>Codes : AddFix.vbs (Before)</summary>

  ```vbs
  ' Subroutine to add a prefix, suffix, or replace part of file names in a folder
  Sub AddFixToFiles(folderPath, substring, fixType, text1, text2, test)
      ……

      For Each objFile In objFolder.Files
          ……
          newFileFullName = ""

          If fixType <> "replace" And MatchesSubstring(fileFullName, substring) Then
              If fixType = "prefix" Then
                  newFileFullName = text1 & fileName & "." & fileExtension
              ElseIf fixType = "suffix" Then
                  newFileFullName = fileName & text1 & "." & fileExtension
              End If
              objFile.Name = newFileFullName
              WScript.Echo "File name changed         : " & folderPath & fileFullName & _
                                                        " -> " & folderPath & newFileFullName
          ElseIf fixType = "replace" And MatchesSubstring(fileFullName, substring) And MatchesSubstring(fileFullName, text1) Then
              newFileFullName = Replace(fileFullName, text1, text2)
              objFile.Name = newFileFullName
              WScript.Echo "File name changed         : " & folderPath & fileFullName & _
                                                        " -> " & folderPath & newFileFullName
          Else
              WScript.Echo "File name does not changed: " & folderPath & fileFullName
          End If

          ……
      Next
  End Sub
  ```
  </details>
  <details>
    <summary>Codes : AddFix_b.vbs (After)</summary>

  ```vbs
  ' Subroutine to add a prefix, suffix, or replace part of file names in a folder
  Sub AddFixToFiles(folderPath, substring, fixType, text1, text2, test)
      ……

      For Each objFile In objFolder.Files
          ……
          newFileFullName = ""

          If MatchesSubstring(fileFullName, substring) Then
              If fixType = "prefix" Then
                  newFileFullName = text1 & fileName & "." & fileExtension
              ElseIf fixType = "suffix" Then
                  newFileFullName = fileName & text1 & "." & fileExtension
              ElseIf fixType = "replace" And MatchesSubstring(fileFullName, text1) Then
                  newFileFullName = Replace(fileFullName, text1, text2)
              End If

              If newFileFullName <> "" Then
                  objFile.Name = newFileFullName
                  WScript.Echo "File name changed         : " & folderPath & fileFullName & _
                                                            " -> " & folderPath & newFileFullName
              Else
                  WScript.Echo "File name does not changed: " & folderPath & fileFullName
              End If
          ' Else
                  ' WScript.Echo "File name does not changed: " & folderPath & fileFullName
          End If

          ……
      Next
  End Sub
  ```
  </details>
  <details open="">
    <summary>Results</summary>

  - Excluded files that were not the target of changes from the output results.
    - Refactoring and changes in the execution results are typically meant to be separate tasks, but I just did it. Who cares?
  ```txt
  File name changed         : .\test1.txt -> .\pf_test1.txt
  File name changed         : .\test2.txt -> .\pf_test2.txt
  ```
  ```txt
  File name changed         : .\pf_test1.txt -> .\test1.txt
  File name changed         : .\pf_test2.txt -> .\test2.txt
  ```
  </details>


## [Add Fix (2023.10.30)](#list)

- Update : Can also add a suffix or replace part of file names in a folder
- Usage
  ```bat
  AddFix.vbs <substring> <prefix/suffix/replace> <text1> <text2(optional only when replace)> <test(optional)>
  ```
  ```bat
  Example 1: cscript AddFix.vbs .txt prefix pf_ test
  Example 2: cscript AddFix.vbs .txt suffix _sf
  Example 3: cscript AddFix.vbs .txt replace pf_ " " test
  ```
- Codes and Results
  <details>
    <summary>Codes : AddFix.vbs</summary>

  ```vbs
  ' Command-line argument check
  Dim argumentCount
  argumentCount = WScript.Arguments.Count
  If argumentCount < 3 Or (LCase(WScript.Arguments(1)) = "replace" And argumentCount < 4) Then
      WScript.Echo "Usage: AddFix.vbs <substring> <prefix/suffix/replace> <text1> <text2(optional only when replace)> <test(optional)>"
      WScript.Quit
  End If
  ```
  ```vbs
  ' Declare variables
  Dim folderPath, substring, fixType, text1, text2, test
  folderPath = ".\" ' Default folder path is the current folder (modifiable)
  substring = WScript.Arguments(0)
  fixType = LCase(WScript.Arguments(1))
  text1 = Trim(WScript.Arguments(2))
  ' Get text2 if "replace" mode
  If fixType = "replace" Then
      text2 = Trim(WScript.Arguments(3))
  Else
      text2 = Trim("")
  End If
  ' Check if test mode is enabled (True) or disabled (False)
  If (fixType <> "replace" And argumentCount > 3) Or (fixType = "replace" And argumentCount > 4) Then
      If LCase(WScript.Arguments(argumentCount - 1)) = "test" Then
          test = True
      Else
          test = False
      End If
  Else
      test = False
  End If
  ```
  ```vbs
  ' Test mode output
  If test = True Then
      WScript.Echo "<Test>" & vbCrLf & _
                  "substring: " & substring & vbCrLf & _
                  "fixType  : " & fixType & vbCrLf & _
                  "text1    : " & text1 & vbCrLf & _
                  "text2    : " & text2 & vbCrLf & _
                  "test     : " & test & vbCrLf
  End If
  ```
  ```vbs
  ' Function to check if a file path has a specified substring
  Function MatchesSubstring(fileFullName, substring)
      If InStr(1, fileFullName, substring) > 0 Then
          MatchesSubstring = True
      Else
          MatchesSubstring = False
      End If
  End Function
  ```
  ```vbs
  ' Subroutine to add a prefix, suffix, or replace part of file names in a folder
  Sub AddFixToFiles(folderPath, substring, fixType, text1, text2, test)
      Dim objFSO, objFolder, objFile
      Set objFSO = CreateObject("Scripting.FileSystemObject")
      Set objFolder = objFSO.GetFolder(folderPath)

      For Each objFile In objFolder.Files
          Dim fileName, fileExtension, fileFullName, newFileFullName
          fileName = objFSO.GetBaseName(objFile)
          fileExtension = LCase(objFSO.GetExtensionName(objFile.Path))
          fileFullName = fileName & "." & fileExtension
          newFileFullName = ""

          If fixType <> "replace" And MatchesSubstring(fileFullName, substring) Then
              If fixType = "prefix" Then
                  newFileFullName = text1 & fileName & "." & fileExtension
              ElseIf fixType = "suffix" Then
                  newFileFullName = fileName & text1 & "." & fileExtension
              End If
              objFile.Name = newFileFullName
              WScript.Echo "File name changed         : " & folderPath & fileFullName & _
                                                        " -> " & folderPath & newFileFullName
          ElseIf fixType = "replace" And MatchesSubstring(fileFullName, substring) And MatchesSubstring(fileFullName, text1) Then
              newFileFullName = Replace(fileFullName, text1, text2)
              objFile.Name = newFileFullName
              WScript.Echo "File name changed         : " & folderPath & fileFullName & _
                                                        " -> " & folderPath & newFileFullName
          Else
              WScript.Echo "File name does not changed: " & folderPath & fileFullName
          End If

          ' Test mode output
          If test = True Then
              WScript.Echo "<Test>" & vbCrLf & _
                          "fileName        : " & fileName & vbCrLf & _
                          "fileExtension   : " & fileExtension & vbCrLf & _
                          "MatchesSubstring: " & MatchesSubstring(fileFullName, substring) & vbCrLf & _
                          "newFileFullName : " & newFileFullName & vbCrLf
          End If
      Next
  End Sub
  ```
  ```vbs
  AddFixToFiles folderPath, substring, fixType, text1, text2, test
  ```
  </details>
  <details open="">
    <summary>Codes : AddFixRun.bat</summary>

  ```bat
  cscript AddFix.vbs .txt prefix pf_ test
  @REM cscript AddFix.vbs .txt suffix _sf
  cscript AddFix.vbs .txt replace pf_ " " test
  ```
  </details>
  <details open="">
    <summary>Results (Normal)</summary>

  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  File name does not changed: .\AddFix.vbs
  File name does not changed: .\AddFixRun.bat
  File name does not changed: .\AddPrefix.vbs
  File name does not changed: .\AddPrefixRun.bat
  File name does not changed: .\README.md
  File name changed         : .\test1.txt -> .\pf_test1.txt
  File name changed         : .\test2.txt -> .\pf_test2.txt
  File name does not changed: .\test3.dat
  ```
  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  File name does not changed: .\AddFix.vbs
  File name does not changed: .\AddFixRun.bat
  File name does not changed: .\AddPrefix.vbs
  File name does not changed: .\AddPrefixRun.bat
  File name changed         : .\pf_test1.txt -> .\test1.txt
  File name changed         : .\pf_test2.txt -> .\test2.txt
  File name does not changed: .\README.md
  File name does not changed: .\test3.dat
  ```
  </details>
  <details>
    <summary>Results (Test)</summary>

  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  <Test>
  substring: .txt
  fixType  : prefix
  text1    : pf_
  text2    :
  test     : True

  File name does not changed: .\AddFix.vbs
  <Test>
  fileName        : AddFix
  fileExtension   : vbs
  MatchesSubstring: False
  newFileFullName :

  ……

  File name changed         : .\test1.txt -> .\pf_test1.txt
  <Test>
  fileName        : test1
  fileExtension   : txt
  MatchesSubstring: True
  newFileFullName : pf_test1.txt

  ……
  ```
  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  <Test>
  substring: .txt
  fixType  : replace
  text1    : pf_
  text2    :
  test     : True

  File name does not changed: .\AddFix.vbs
  <Test>
  fileName        : AddFix
  fileExtension   : vbs
  MatchesSubstring: False
  newFileFullName :

  ……

  File name changed         : .\pf_test1.txt -> .\test1.txt
  <Test>
  fileName        : pf_test1
  fileExtension   : txt
  MatchesSubstring: True
  newFileFullName : test1.txt

  ……
  ```
  </details>


## [Add Prefix (2023.10.17)](#list)

- Add a prefix to files with a specific extension in a folder
- Usage
  ```bat
  AddPrefix.vbs <extension> <prefix> <test:1/0>
  ```
- Future Improvements
  - Extend to accept wildcards as arguments, rather than just simple file extensions
  - Add a replace feature, since mistakes can be critical → Done([Add Fix (2023.10.30)](#add-fix-20231030))
- Codes and Results
  <details>
    <summary>Codes : AddPrefix.vbs</summary>

  ```vbs
  ' Command-line argument check
  If WScript.Arguments.Count < 2 Then
      WScript.Echo "Usage: AddPrefix.vbs <extension> <prefix> <test:1/0>"
      WScript.Quit
  End If
  ```
  ```vbs
  ' Decalre variables
  Dim folderPath, extension, prefix, test
  ' Default folder path is the current folder (modifiable)
  folderPath = ".\"
  extension = WScript.Arguments(0)
  prefix = WScript.Arguments(1)
  ' Check if the test mode is enabled (1) or disabled (0)
  If WScript.Arguments.Count >= 3 Then
      test = WScript.Arguments(2)
  Else
      test = 0
  End If

  ' Test mode
  If test = 1 Then
      WScript.Echo "<Test>" & vbCrLf & _
                   "extension: " & extension & vbCrLf & _
                   "prefix   : " & prefix & vbCrLf & _
                   "test     : " & test & vbCrLf
  End If
  ```
  ```vbs
  ' Function to check if a file path matches the specified extension
  Function MatchesExtension(input, extension)
      Dim fileExtension
      fileExtension = LCase(Right(input, Len(extension)))
      If fileExtension = extension Then
          MatchesExtension = True
      Else
          MatchesExtension = False
      End If
  End Function
  ```
  ```vbs
  ' Subroutine to add a prefix to file names with the specified extension
  Sub AddPrefixToFiles(folderPath, extension, prefix)
      Dim objFSO, objFolder, objFile
      Set objFSO = CreateObject("Scripting.FileSystemObject")
      Set objFolder = objFSO.GetFolder(folderPath)

      For Each objFile In objFolder.Files
          Dim fileName, fileExtension, newFileName
          fileName = objFSO.GetBaseName(objFile)
          fileExtension = LCase(objFSO.GetExtensionName(objFile.Path))

          If MatchesExtension(objFile.Path, extension) Then
              newFileName = prefix & fileName & "." & fileExtension
              objFile.Name = newFileName
              WScript.Echo "File name changed         : " & folderPath & fileName & "." & fileExtension _ 
                                                        & " -> " & folderPath & newFileName
          Else
              WScript.Echo "File name does not changed: " & folderPath & fileName & "." & fileExtension
          End If

          ' Test mode output
          If test = 1 Then
              WScript.Echo "<Test>" & vbCrLf & _
                           "fileName        : " & fileName & vbCrLf & _
                           "fileExtension   : " & fileExtension & vbCrLf & _
                           "MatchesExtension: " & MatchesExtension(objFile.Path, extension) & vbCrLf & _
                           "newFileName     : " & newFileName & vbCrLf
          End If
      Next
  End Sub
  ```
  ```vbs
  ' Add a prefix to file names with the specified extension
  AddPrefixToFiles folderPath, extension, prefix
  ```
  </details>
  <details open="">
    <summary>Codes : AddPrefixRun.bat</summary>

  ```bat
  cscript AddPrefix.vbs txt prefix_
  ```
  </details>
  <details open="">
    <summary>Results (Normal)</summary>

  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  File name does not changed: .\AddPrefix.vbs
  File name does not changed: .\AddPrefixRun.bat
  File name does not changed: .\README.md
  File name changed         : .\test1.txt -> .\prefix_test1.txt
  File name changed         : .\test2.txt -> .\prefix_test2.txt
  File name does not changed: .\test3.dat
  ```
  </details>
  <details>
    <summary>Results (Test)</summary>

  ```txt
  Microsoft (R) Windows Script Host 버전 5.812
  Copyright (C) Microsoft Corporation. All rights reserved.

  <Test>
  extension: txt
  prefix   : prefix_
  test     : 1

  File name does not changed: .\AddPrefix.vbs
  <Test>
  fileName        : AddPrefix
  fileExtension   : vbs
  MatchesExtension: False
  newFileName     :

  ……

  File name changed         : .\test1.txt -> .\prefix_test1.txt
  <Test>
  fileName        : test1
  fileExtension   : txt
  MatchesExtension: True
  newFileName     : prefix_test1.txt

  ……
  ```
  </details>
