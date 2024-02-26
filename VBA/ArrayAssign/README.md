# [Array Assignment](/README.md#vba)

Improve the Syntax for Array Assignment


### \<List>

- [Array Assignment (2024.02.26)](#array-assignment-20240226)


## [Array Assignment (2024.02.26)](#list)

- Feature
  - Can enter an array in one line by enclosing it in `{}` like in other languages
  - Only one-dimensional arrays are supported
- Future Improvement
  - Apply to n-dimensional arrays
- Code and Result
  <details>
    <summary>Code : ArryAssign.bas</summary>

    ```vba
    Option Explicit
    ```
    ```vba
    ' This function converts a string into a one-dimensional array
    ' The string should be in the format of {a, b, c, ...}
    ' The function replaces the curly brackets with empty spaces and splits the string by commas
    ' The function returns a variant array
    Private Function StringToArray(str As String) As Variant
        'Replace the curly brackets with empty spaces
        str = Replace(str, "{", "")
        str = Replace(str, "}", "")
        'Split the string by commas and convert it into an array
        ' str = Replace(str, ", ", ",")                         ' Trim() is the better way
        StringToArray = Split(str, ",")
    End Function
    ```
    ```vba
    ' This function assigns an array to a variable using a string input
    ' The string should be in the format of {a, b, c, ...}
    ' The function calls the StringToArray function to convert the string into an array
    ' The function returns a variant array
    Private Function AssignArray(str As String) As Variant
        'Call the StringToArray function to convert the string into an array
        AssignArray = StringToArray(str)
    End Function
    ```
    ```vba
    ' This procedure tests the AssignArray function
    ' It assigns an array to a variable using a string input
    ' It prints the values of the array in the immediate window
    Private Sub ArrayTest()
        'Assign an array to a variable using a string input
        Dim arr  As Variant
        arr = AssignArray("{1, 2, 3, 4}")

        'Print the values of the array in the immediate window
        Dim i As Long
        For i = LBound(arr) To UBound(arr)
            Debug.Print Trim(arr(i)) & " ";
        Next i
        Debug.Print
    End Sub
    ```
    </details>
    <details open="">
      <summary>Result</summary>

    ```vba
    arr = AssignArray("{1, 2, 3, 4}")
    ```
    ```vba
    1 2 3 4
    ```
    </details>
