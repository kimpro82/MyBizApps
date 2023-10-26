# [Add Prefix (VBScript)](../../README.md#shell)

Add a prefix to files with a specific extension in a folder


### \<List>

- [Add Prefix (2023.10.17)](#add-prefix-20231017)


## [Add Prefix (2023.10.17)](#list)

- Usage
  ```bat
  AddPrefix.vbs <extension> <prefix> <test:1/0>
  ```
- Future Improvements
  - Extend to accept wildcards as arguments, rather than just simple file extensions
  - Add a replace feature, since mistakes can be critical
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