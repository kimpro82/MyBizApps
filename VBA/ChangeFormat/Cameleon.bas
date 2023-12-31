' Randomly Change the Format Colors of the Chart
' 2021.08.31


Option Explicit


Sub Cameleon()

    Dim rnd1 As Integer, rnd2 As Integer, rnd3 As Integer
    Randomize
    rnd1 = Rnd * 255

    Worksheets(1).ChartObjects(1).Activate

    Dim i As Integer
    For i = 1 To 5

        rnd1 = (rnd1 * i) Mod 256
        rnd2 = (rnd1 * i) Mod 256
        rnd3 = (rnd2 * i) Mod 256

        Application.ScreenUpdating = False

        'Line
        ActiveChart.FullSeriesCollection(1).Select
        With Selection.Format.Line
            .ForeColor.RGB = RGB(rnd1, rnd2, rnd3)
            .Visible = msoTrue
            .Transparency = 0
        End With

        'Data Label
        ActiveChart.FullSeriesCollection(1).DataLabels.Select
        With Selection.Format.TextFrame2.TextRange.Font.Fill
            .ForeColor.RGB = RGB(rnd1, rnd2, rnd3)
            .Visible = msoTrue
            .Transparency = 0
            .Solid
        End With

        Application.ScreenUpdating = True

        Application.Wait Now + TimeValue("00:00:01")

    Next i

End Sub
