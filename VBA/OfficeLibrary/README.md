# Office Library Management

Reading leads you a better slav …… employee


### \<List>

- [Office Library Management (2022.07.13)](#)


## [Office Library Management (2022.07.13)](#list)

- Update plural pivot tables at the same time with one click
- Somewhat shameful code …… but it seems able to be improved more

#### OfficeLibrary.bas
```vba
Option Explicit
```
```vba
Sub Update()

    PivotTables("PivotTable1").PivotCache.Refresh
    PivotTables("PivotTable2").PivotCache.Refresh
    PivotTables("PivotTable3").PivotCache.Refresh
    PivotTables("PivotTable4").PivotCache.Refresh

End Sub
```
```vba
Private Sub btnUpdate_Click()

    Application.Calculation = xlManual
        Call Update
    Application.Calculation = xlAutomatic

End Sub
```