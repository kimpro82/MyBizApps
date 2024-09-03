'*********************************************************************
' Progress Rate Tracker for Development Plan (Burn-up Chart)
' Date: 2024.09.02
'
' This Excel VBA script is designed to track and update progress rates
' in a development plan. It calculates the total, done, and remained
' rates for a series of tasks over a specified period. The script
' automatically updates the progress data based on the current day
' and clears any outdated information before recalculating.
'
' Key Features:
' - Calculates total, done, and remained rates for each day.
' - Only updates done and remained rates up to the current day.
' - Clears previous calculation results before updating with new data.
'
' How it Works:
' - Total rate: Calculated based on the weighted contribution of tasks
'   with any progress indicated by cell color.
' - Done rate: Accumulates progress up to the current day.
' - Remained rate: Computed as the difference between total and done rates.
'
' Input:
' - Start and end columns for tracking (RATE_START_COL, RATE_END_COL).
' - Data range starting from a specified row (DATA_START_ROW).
' - Current day is provided in a specific cell (TODAY_LOC).
'
' Output:
' - Populates cells with total, done, and remained rates in specific rows
'   (TOTAL_ROW, DONE_ROW, REMAINED_ROW).
'
' Execution:
' - The script is triggered manually via a button in the Excel interface
'   (btnUpdate_Click).
'
'*********************************************************************


Option Explicit


' Constants for the columns and rows used in the development plan tracking
Private Const RATE_START_COL As String = "G"      ' Start column for the rate tracking
Private Const RATE_END_COL As String = "AK"       ' End column for the rate tracking

Private Const DAY_ROW As Long = 24                ' Row number where the day is stored
Private Const TOTAL_ROW As Long = 25              ' Row number for total rate calculations
Private Const DONE_ROW As Long = 26               ' Row number for done rate calculations
Private Const REMAINED_ROW As Long = 27           ' Row number for remained rate calculations

Private Const WEIGHT_COL As String = "F"          ' Column to determine the last row of data
Private Const DATA_START_ROW As Long = 28         ' Row number where the data starts

Private Const TODAY_LOC As String = "C23"         ' Cell location where the current day is stored


' Subroutine to update the progress tracking values
Private Sub UpdateValues()

    Dim rateStartColNum As Long                   ' Column number where rate tracking starts
    Dim rateEndColNum As Long                     ' Column number where rate tracking ends
    Dim updateRangeString As String               ' String to store the range for updates
    Dim dataLastRowNum As Long                    ' Last row number with data
    Dim currentDay As Long                        ' Current day extracted from TODAY_LOC

    ' Convert column letters to column numbers
    rateStartColNum = Range(RATE_START_COL & ":" & RATE_START_COL).Column
    rateEndColNum = Range(RATE_END_COL & ":" & RATE_END_COL).Column

    ' Define the range to be cleared before updating values
    updateRangeString = RATE_START_COL & DONE_ROW & ":" & RATE_END_COL & REMAINED_ROW
    Range(updateRangeString).ClearContents

    ' Find the last row of data in the WEIGHT_COL column
    dataLastRowNum = Cells(DATA_START_ROW, WEIGHT_COL).End(xlDown).Row

    ' Get the current day from the TODAY_LOC cell
    currentDay = Day(Range(TODAY_LOC).value)

    Dim col As Long
    ' Loop through each column between rateStartColNum and rateEndColNum
    For col = rateStartColNum To rateEndColNum
        ' Calculate total rate for the column
        Cells(TOTAL_ROW, col) = CalculateTotalRate(col, dataLastRowNum)

        ' Only calculate done and remained rates if the day is on or before the current day
        If Cells(DAY_ROW, col).value <= currentDay Then
            Cells(DONE_ROW, col) = CalculateDoneRate(col, rateStartColNum, dataLastRowNum)
            Cells(REMAINED_ROW, col) = CalculateRemainedRate(col, rateStartColNum, dataLastRowNum)
        End If
    Next col

End Sub


' Function to calculate the total rate for a specific column
' Parameters:
'   - col: Column number for which the total rate is calculated
'   - lastRowNum: Last row number with data
' Returns:
'   - The calculated total rate for the column
Private Function CalculateTotalRate(col As Long, lastRowNum As Long) As Double

    Dim value As Double                           ' Stores the total rate value
    Dim rowNum As Long                            ' Row counter

    ' Loop through each row in the data range
    For rowNum = DATA_START_ROW To lastRowNum
        ' Only consider cells with background color (non-empty)
        If Cells(rowNum, col).Interior.ColorIndex > 0 Then
            value = value + Cells(rowNum, WEIGHT_COL).value * 100
        End If
    Next rowNum

    CalculateTotalRate = value

End Function


' Function to calculate the done rate for a specific column
' Parameters:
'   - col: Column number for which the done rate is calculated
'   - startColNum: Column number where rate tracking starts
'   - lastRowNum: Last row number with data
' Returns:
'   - The calculated done rate for the column
Private Function CalculateDoneRate(col As Long, startColNum As Long, lastRowNum As Long) As Double

    Dim value As Double                           ' Stores the done rate value

    ' Calculate the sum product of the weight and progress in the column
    value = WorksheetFunction.SumProduct( _
                Range(Cells(DATA_START_ROW, WEIGHT_COL), Cells(lastRowNum, WEIGHT_COL)), _
                Range(Cells(DATA_START_ROW, col), Cells(lastRowNum, col)) _
            ) * 100

    ' Add the done rate from the previous column if applicable
    If col > startColNum Then
        value = value + Cells(DONE_ROW, col - 1).value
    End If

    CalculateDoneRate = value

End Function


' Function to calculate the remained rate for a specific column
' Parameters:
'   - col: Column number for which the remained rate is calculated
'   - startColNum: Column number where rate tracking starts
'   - lastRowNum: Last row number with data
' Returns:
'   - The calculated remained rate for the column
Private Function CalculateRemainedRate(col As Long, startColNum As Long, lastRowNum As Long) As Double

    Dim value As Double                           ' Stores the remained rate value

    ' Calculate the remained rate as the difference between total and done rates
    value = Cells(TOTAL_ROW, col).value - Cells(DONE_ROW, col).value

    CalculateRemainedRate = value

End Function


' Subroutine called when the update button is clicked
' This subroutine changes Excel's calculation mode to manual before updating values
' for performance reasons and restores it back to automatic afterward.
Private Sub btnUpdate_Click()
    Application.Calculation = xlManual            ' Set calculation to manual for performance
        Call UpdateValues
    Application.Calculation = xlAutomatic         ' Restore calculation to automatic

End Sub
