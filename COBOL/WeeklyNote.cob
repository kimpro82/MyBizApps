      * Diary Page Layout Division Algorithm
      * 2023.09.05

       IDENTIFICATION DIVISION.
           PROGRAM-ID. WeeklyNote.

       DATA DIVISION.
           WORKING-STORAGE SECTION.
              01 n        PIC 9(3).
              01 weekdays PIC 9(3).
              01 weekends PIC 9(3).
              01 saturday PIC 9(3).
              01 sunday   PIC 9(3).

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
