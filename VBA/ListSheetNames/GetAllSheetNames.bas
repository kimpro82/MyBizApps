' Get All Sheet Names in the Excel Workbook
' : Retrieves sheet names and prints them in a column
' 2023.11.15
'
' This subroutine iterates through each worksheet in the active workbook,
' retrieves its name, and outputs the names in a column.


Option Explicit


Private Sub GetAllSheetNames()

    Dim ws As Worksheet
    Dim sheetNames() As String
    Dim i As Integer

    ' Resize the array to the number of sheets in the workbook
    ReDim sheetNames(1 To Sheets.Count)

    ' Loop through each worksheet and store its name in the array
    For Each ws In ThisWorkbook.Sheets
        i = i + 1
        sheetNames(i) = ws.Name
        ' Debug.Print sheetNames(i)                         ' Ok
    Next ws

    ' Output sheet names in a column in the active sheet without a loop
    Range("A1").Resize(UBound(sheetNames), 1).Value = Application.Transpose(sheetNames)

End Sub
