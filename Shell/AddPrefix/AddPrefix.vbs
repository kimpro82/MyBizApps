' VBScript to add a prefix to files with a specific extension in a folder
' Created on: 2023.10.17

' Usage: AddPrefix.vbs <extension> <prefix> <test:1/0>
' Example: cscript AddPrefix.vbs cpp prefix_ 1


' Command-line argument check
If WScript.Arguments.Count < 2 Then
    WScript.Echo "Usage: AddPrefix.vbs <extension> <prefix> <test:1/0>"
    WScript.Quit
End If

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

' Add a prefix to file names with the specified extension
AddPrefixToFiles folderPath, extension, prefix
