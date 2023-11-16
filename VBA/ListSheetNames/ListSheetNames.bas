' List All Sheet Names in the Excel Workbook
' 2023.11.15
'
' - Retrieves all sheet names in the active workbook and prints them in a column
' - Can activate a specific sheet when click


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
        ' Debug.Print sheetNames(i)                         ' For debugging purposes
    Next ws

    ' Output sheet names in a column in the active sheet without a loop
    Range("A1").Resize(UBound(sheetNames), 1).Value = Application.Transpose(sheetNames)

End Sub


Private Sub Worksheet_SelectionChange(ByVal Target As Range)

    If Target.Cells.CountLarge = 1 Then ' Checking if only a single cell is selected
        Dim wsName As String
        wsName = Target.Value ' Store the value of the selected cell

        ' If a sheet with the given name exists, activate it
        If WorksheetExists(wsName) Then
            Sheets(wsName).Activate
        End If
    End If

End Sub


Function WorksheetExists(wsName As String) As Boolean

    ' Check if a sheet with the given name exists
    On Error Resume Next
        WorksheetExists = Not Sheets(wsName) Is Nothing
    On Error GoTo 0

End Function


Private Sub btn_GetAllSheetNames_Click()

    ' Clear data in column A
    Columns("A:A").Clear

    ' Execute the GetAllSheetNames function
    GetAllSheetNames

End Sub
