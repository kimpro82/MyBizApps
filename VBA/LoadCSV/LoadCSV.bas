' CSV 파일 로드 및 실행 프로시저
' 2023.08.04


Option Explicit


Private pythonScriptPath    As String
Private pythonExe           As String
Private pythonArgs          As String
Private csvFilePath         As String
Private startCell           As Range


' 파라미터 설정 프로시저
Private Sub SetParameters()

    ' 파이썬 스크립트의 경로 설정
    pythonScriptPath = ".\save_csv.py"

    ' 파이썬 실행 파일과 인자 설정
    pythonExe = "C:\Python\Python38-64\python.exe"                              ' 파이썬 실행 파일 경로
    pythonArgs = pythonScriptPath                                               ' 파이썬 스크립트 경로를 인자로 전달

    ' .csv 파일 저장 경로 설정 (파이썬 스크립트가 .csv 파일을 생성할 경로)
    csvFilePath = ".\test_csv.csv"

    ' 데이터를 불러올 시작 셀 지정
    Set startCell = ThisWorkbook.Sheets("LoadCSV").Range("A3")                  ' A3 셀부터 데이터를 불러옴

End Sub


' 파이썬 스크립트 실행 프로시저
Private Sub RunPythonScript()

    ' 파이썬 스크립트 실행
    Shell pythonExe & " " & pythonArgs

End Sub


' CSV 파일 로드 및 붙여넣기 프로시저
Private Sub LoadCSV()

    ' .csv 파일을 엑셀로 불러와서 시작 셀에 붙여넣기
    Workbooks.Open Filename:=csvFilePath
        ActiveSheet.UsedRange.Copy Destination:=startCell
    ActiveWorkbook.Close SaveChanges:=False

End Sub


' 버튼 클릭 이벤트 프로시저
Private Sub btn1_Click()

    Application.Calculation = xlManual

        Call SetParameters
        Call RunPythonScript
        Call LoadCSV

    Application.Calculation = xlAutomatic

End Sub
