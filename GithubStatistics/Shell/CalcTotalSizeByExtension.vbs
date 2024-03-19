' Calculate the Total Number and Size of Files by Extension in All Subfolders
' 2024.03.19

' Run in Console
' > cscript ./CalcTotalSizeByExtension.vbs


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
