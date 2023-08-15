' Excel VBA × ChatGPT V0.3
' 2023.08.14


Option Explicit


Private Type ParametersType

    ' Worksheet에서 범위로 선언
    ws              As Worksheet
    modelRange      As Range
    tokensRange     As Range
    maxTokensRange  As Range
    questionRange   As Range
    answerRange     As Range

    currentFilePath As String
    pythonExe       As String
    pythonArgs      As String
    ymlFilePath     As String

End Type


' 파라미터 설정 프로시저
Private Sub SetParameters(ByRef thisType As ParametersType)

    ' `Set` 키워드 누락 주의!
    Set thisType.ws = ThisWorkbook.Sheets("ChatGPT0.3")
    Set thisType.modelRange = Range("C5")
    Set thisType.tokensRange = Range("E5")
    Set thisType.maxTokensRange = Range("G5")
    Set thisType.questionRange = Range("C11")
    Set thisType.answerRange = thisType.ws.Range("C12")

    thisType.currentFilePath = ThisWorkbook.path
    thisType.pythonExe = "C:\Python\Python38-64\python.exe"
    thisType.pythonArgs = ".\QAWithChatGPT_V0.3.py"
    thisType.ymlFilePath = ".\QAWithChatGPT_V0.3.yml"

End Sub


' 유니코드 문자열 파싱 프로시저
Private Function ParseUnicodeString(ByRef inputString As String) As String

    Dim replacedString  As String
    Dim parsedString    As String
    Dim splitArray()    As String
    Dim i               As Integer

    ' \u를 공백으로 대체하고 "를 제외한 문자열로 수정
    replacedString = Replace(inputString, " ", " \nbsp ")
    replacedString = Replace(replacedString, "\u", " ")

    ' 수정된 문자열을 공백으로 나눠서 배열에 담기
    splitArray = Split(replacedString, " ")

    ' 배열 내용 출력
    parsedString = ""
    For i = LBound(splitArray) To UBound(splitArray)
        Debug.Print i & " : " & splitArray(i)
        If Len(splitArray(i)) = 4 Then
            parsedString = parsedString & ChrW("&H" & Left(splitArray(i), 4))
        ElseIf Len(splitArray(i)) >= 5 Then
            If splitArray(i) = "\nbsp" Then
                parsedString = parsedString & " "
            Else
                parsedString = parsedString & ChrW("&H" & Left(splitArray(i), 4))
                parsedString = parsedString & Mid(splitArray(i), 5, Len(splitArray(i)) - 4)
            End If
        Else
            parsedString = parsedString & splitArray(i)
        End If
    Next i

    ParseUnicodeString = parsedString

End Function


' YAML 내용 읽어서 표시하는 프로시저
Private Sub ReadAndDisplayYAMLContent(ByRef thisType As ParametersType)

    Dim ws              As Worksheet

    Dim fileName        As String
    Dim fileContent     As String
    Dim content         As String
    Dim parsedContent   As String
    Dim regex           As Object
    Dim matches         As Object

    ' 외부 YAML 파일 경로
    fileName = thisType.currentFilePath & thisType.ymlFilePath
    Debug.Print "fileName : " & fileName                                        ' ok

    ' 외부 파일 읽기
    With CreateObject("Scripting.FileSystemObject")
        If .FileExists(fileName) Then
            fileContent = .OpenTextFile(fileName).ReadAll
        Else
            MsgBox "File not found"
            Exit Sub
        End If
    End With

    ' 정규식 객체 생성
    Set regex = CreateObject("VBScript.RegExp")
    regex.Global = True
    regex.IgnoreCase = True
    regex.Pattern = "content: (.+)"

    ' 정규식 패턴과 일치하는 부분 찾기
    Set matches = regex.Execute(fileContent)

    ' 일치하는 내용 추출
    If matches.Count > 0 Then
        content = matches(0).SubMatches(0)
        Debug.Print "content : " & content
        parsedContent = ParseUnicodeString(content)
        thisType.answerRange.Value = parsedContent
        ' ThisWorkbook.Save                                                     ' 파일 저장
        ' MsgBox "Content displayed and file saved successfully."
    Else
        MsgBox "Content not found"
    End If

End Sub


' 실행 버튼 클릭 이벤트 핸들러
Private Sub btnRun_Click()

    Application.Calculation = xlManual

        Dim Parameters As ParametersType
        Call SetParameters(Parameters)

        If Parameters.modelRange.Value = "" Then
            Parameters.answerRange.Value = "모델을 선택해주세요."
        ElseIf Parameters.questionRange.Value = "" Then
            Parameters.answerRange.Value = "질문을 입력해주세요."
        ElseIf Parameters.tokensRange.Value = "" Then
            Parameters.answerRange.Value = "토큰 수를 입력해주세요(< 최대 토큰)."
        ElseIf (Parameters.maxTokensRange.Value <> "auto") And _
            (CInt(Parameters.tokensRange.Value) > CInt(Parameters.maxTokensRange.Value)) Then
            Parameters.answerRange.Value = "설정한 토큰 수가 최대 토큰 수보다 많습니다."
        Else
            Debug.Print "Shell : " & Parameters.pythonExe & " " & Parameters.pythonArgs
            Shell Parameters.pythonExe & " " & Parameters.pythonArgs
            Call ReadAndDisplayYAMLContent(Parameters)
        End If

    Application.Calculation = xlAutomatic

End Sub


' 초기화 버튼 클릭 이벤트 핸들러
Private Sub btnClear_Click()

    Application.Calculation = xlManual

        Dim CellLocations As CellLocationsType
        Call SetCellLocations(CellLocations)

        CellLocations.tokensRange.Value = ""
        CellLocations.questionRange.Value = ""
        CellLocations.answerRange.Value = ""

    Application.Calculation = xlAutomatic

End Sub
