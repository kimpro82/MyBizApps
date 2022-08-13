# Find and Change a Substring

a requested code


### \<List>

- [Find and Change a Substring (2022.08.12)](#find-and-change-a-substring-20220812)


## [Find and Change a Substring (2022.08.12)](#list)

- Change the substring's property partially, not the whole string's in the cell

![Find and Change a Substring](Images/VBA_FindAndChange_20220812.gif)

#### `FindAndChange.bas`
```vba
Option Explicit
```
```vba
' A sub procedure to find a substring in a cell and change its color partially
Sub FindAndChange()

    ' Set variables
    Dim dataZero As Range                                   ' dataZero  : the zeropoint to start data
    Dim str As String                                       ' str       : the string to search
    Dim length As Integer                                   ' length    : the length of str
    Dim row As Integer                                      ' row       : the number of rows that contain data from dataZero

    Set dataZero = Range("A1")
    str = Range("D1").Value
    length = Len(str)
    With UsedRange
        row = Cells(Rows.Count, 1).End(xlUp).row - dataZero.row + 1
    End With

    ' Main operation : find the index of the target substring and change its property
    Dim idx As Integer
    Dim r As Integer
    For r = 0 To row - 1
        idx = InStr(1, dataZero.Offset(r, 0), str)          ' idx == 0 means the target substring is absent
        If idx > 0 Then
            With dataZero.Offset(r, 0).Characters(Start:=idx, length:=length).Font
                ' .Name = "맑은 고딕"
                ' .FontStyle = "보통"
                ' .Size = 11
                ' .Strikethrough = False
                ' .Superscript = False
                ' .Subscript = False
                ' .OutlineFont = False
                ' .Shadow = False
                ' .Underline = xlUnderlineStyleNone
                .Color = RGB(255, 0, 0)                     ' RGB(255, 0, 0) : Red
                ' .TintAndShade = 0
                ' .ThemeFont = xlThemeFontMinor
            End With
        End If
    Next r

End Sub
```
```vba
' Button to run FindAndChange()
Private Sub btnFindAndChange_Click()

    Application.Calculation = xlManual                      ' make the following procedure run faster
        Call FindAndChange
    Application.Calculation = xlAutomatic

End Sub
```