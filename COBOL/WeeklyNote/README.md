# [Diary Page Layout Division Algorithm (COBOL)](../../README.md#cobol)

COBOL never dies


### \<List>

- [Weekly Note (2023.09.05)](#weekly-note-20230905)


## [Weekly Note (2023.09.05)](#list)

- Return the number of lines assigned to each day for a week from the given number of lines `n` for a diary page
- Weekends can have fewer lines assigned than weekdays, but they cannot be less than half of the weekday lines.
- Why *COBOL*? Ordinary languages are too ordinary!

  <details>
    <summary>Codes : WeeklyNote.cob</summary>

  ```cobol
        IDENTIFICATION DIVISION.
            PROGRAM-ID. WeeklyNote.
  ```
  ```cobol
        DATA DIVISION.
            WORKING-STORAGE SECTION.
                01 n        PIC 9(3).
                01 weekdays PIC 9(3).
                01 weekends PIC 9(3).
                01 saturday PIC 9(3).
                01 sunday   PIC 9(3).
  ```
  ```cobol
        PROCEDURE DIVISION.
            DISPLAY "Enter the total number of lines: " NO ADVANCING
            ACCEPT n.

            COMPUTE weekdays = n / 6.
            COMPUTE weekends = n - (weekdays * 5).
            IF FUNCTION MOD(weekends, 2) = 1 THEN
                COMPUTE saturday = (weekends / 2) + 1
            ELSE
                COMPUTE saturday = weekends / 2
            END-IF.
            COMPUTE sunday = weekends - saturday.

            DISPLAY "Monday   : " weekdays
            DISPLAY "Tuesday  : " weekdays
            DISPLAY "Wednesday: " weekdays
            DISPLAY "Thursday : " weekdays
            DISPLAY "Friday   : " weekdays
            DISPLAY "Saturday : " saturday
            DISPLAY "Sunday   : " sunday.

            STOP RUN.
  ```
  </details>

  <details open="">
    <summary>Results</summary>

  ```txt
  Enter the total number of lines: 35
  Monday   : 005
  Tuesday  : 005
  Wednesday: 005
  Thursday : 005
  Friday   : 005
  Saturday : 005
  Sunday   : 005
  ```
  ```txt
  Enter the total number of lines: 36
  Monday   : 006
  Tuesday  : 006
  Wednesday: 006
  Thursday : 006
  Friday   : 006
  Saturday : 003
  Sunday   : 003
  ```
  ```txt
  Enter the total number of lines: 37
  Monday   : 006
  Tuesday  : 006
  Wednesday: 006
  Thursday : 006
  Friday   : 006
  Saturday : 004
  Sunday   : 003
  ```
  </details>
