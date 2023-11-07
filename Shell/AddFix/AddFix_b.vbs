' VBScript to add a prefix, suffix, or replace part of file names in a folder
' Created on: 2023.11.07

' Usage: AddFix.vbs <substring> <prefix/suffix/replace> <text1> <text2(optional only when replace)> <test(optional)>
' Example 1: cscript AddFix.vbs .txt prefix pf_ test
' Example 2: cscript AddFix.vbs .txt suffix _sf
' Example 3: cscript AddFix.vbs .txt replace pf_ " " test

' History
' 2023.10.17 Init.      : Added the ability to add a prefix to files with a specific extension in a folder
' 2023.10.30 Add Feature: Extended functionality to add suffixes or replace parts of file names in a folder
' 2023.11.07 Refactoring: Improvement of conditional branching for `prefix` `suffix` `replace`


' Command-line argument check
Dim argumentCount
argumentCount = WScript.Arguments.Count
If argumentCount < 3 Or (LCase(WScript.Arguments(1)) = "replace" And argumentCount < 4) Then
    WScript.Echo "Usage: AddFix.vbs <substring> <prefix/suffix/replace> <text1> <text2(optional only when replace)> <test(optional)>"
    WScript.Quit
End If

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

' Test mode output
' It seems that encapsulating these outputs in a function is not feasible.
' Because VBScript does not provide the capability to output variable names as strings.
If test = True Then
    WScript.Echo "<Test>" & vbCrLf & _
                 "substring: " & substring & vbCrLf & _
                 "fixType  : " & fixType & vbCrLf & _
                 "text1    : " & text1 & vbCrLf & _
                 "text2    : " & text2 & vbCrLf & _
                 "test     : " & test & vbCrLf
End If

' Function to check if a file path has a specified substring
Function MatchesSubstring(fileFullName, substring)
    If InStr(1, fileFullName, substring) > 0 Then
        MatchesSubstring = True
    Else
        MatchesSubstring = False
    End If
End Function

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

' Run
AddFixToFiles folderPath, substring, fixType, text1, text2, test
