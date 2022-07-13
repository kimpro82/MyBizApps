Sub Update()

    PivotTables("PivotTable1").PivotCache.Refresh
    PivotTables("PivotTable2").PivotCache.Refresh
    PivotTables("PivotTable3").PivotCache.Refresh
    PivotTables("PivotTable4").PivotCache.Refresh

End Sub


Private Sub btnUpdate_Click()

    Application.Calculation = xlManual
        Call Update
    Application.Calculation = xlAutomatic

End Sub