# [Count Text (Shell)](../../README.md#shell)

Count characters, words and lines in a text file


### \<List>

- [Count Text 2 : Bash (2023.02.24)](#count-text-2--bash-20230224)
- [Count Text 1 : Batch File (2023.02.24)](#count-text-1--batch-file-20230224)


## [Count Text 2 : Bash (2023.02.24)](#list)

- Rarely edited from [**ChatGPT**'s base code](https://github.com/kimpro82/MyBizApps/issues/24#issuecomment-1442874538)
- It works well both with English and Korean, unlike [the below `.bat` code](#count-text-1--batch-file-20230224).
- `wc` command is very powerful!  
  : Maybe it counts only the line replacements except `EOF`.  
  &nbsp;&nbsp;(So the last empty line should be needed.)

  <details open="">
    <summary>Codes : CountText.sh</summary>

  ```bash
  #!/bin/bash

  echo -n "Enter the file name: "
  read file

  chars=$(wc -m < "$file")
  words=$(wc -w < "$file")
  lines=$(wc -l < "$file")

  echo "Number of characters : $chars"
  echo "Number of words      : $words"
  echo "Number of lines      : $lines"

  read
  ```
  </details>

  <details open="">
    <summary>Text Sample : Text_Eng.txt and its result</summary>

  ```txt
  As my soul heals the shame
  I will grow through this pain
  Lord, I'm doing all I can
  To be a better man

  ```
  ※ Source : Robbie Williams / Better Man (2001)
  ```
  Number of characters : 106
  Number of words      : 23
  Number of lines      : 4
  ```
  </details>

  <details open="">
    <summary>Text Sample : Text_Kor.txt and its result</summary>

  ```txt
  꿈만큼 이룰 거에요
  너무 늦었단 말은 없어요
  그대를 지켜 주는 건 그대 안에 있어요
  강해져야만 해요
  그것만이 언제나 내 바램이죠

  ```
  ※ Source : 권진원 / 진심 (2003)
  ```
  Number of characters : 77
  Number of words      : 20
  Number of lines      : 5
  ```
  </details>

  <details open="">
    <summary>Text Sample : Text_Mixed.txt and its result</summary>

  ```txt
  떨어짐과 동시에 새롭게 시작하는 폭포
  That's me

  ```
  ※ Source : B.I / Waterfall (2021)
  ```
  Number of characters : 33
  Number of words      : 7
  Number of lines      : 2
  ```
  `That's` seems to be regarded as one words because `'` is not a defined seperator.
  </details>


## [Count Text 1 : Batch File (2023.02.24)](#list)

- [The base codes](https://github.com/kimpro82/MyBizApps/issues/24#issue-1597984032) are from **ChatGPT**
- Batch File doesn't support to count a string's length!
- Successful to count words and lines, but failed to do characters
- But I still love Microsoft :heart:

  <details>
    <summary>Codes : CountText.bat</summary>

  ```bat
  @echo off
  setlocal EnableDelayedExpansion

  @REM Input
  set /p file="Enter the file name : "

  @REM Set Variables
  set chars=0
  set words=0
  set lines=0

  @REM Loop for the each line
  for /f "tokens=*" %%l in ('type %file%') do (

      @REM test : ok
      echo %%l

      @REM Count chars : failed
      @REM set /a chars+=1

      @REM Count words
      @REM "delims={space}{tab}" is default
      for %%w in (%%l) do (

          @REM test : ok
          @REM echo %%w

          set /a words+=1
      )

      @REM Count lines
      set /a lines+=1

      @REM test
      echo !chars! !words! !lines!
  )

  @REM Output
  echo Number of characters : %chars%
  echo Number of words      : %words%
  echo Number of lines      : %lines%
  ```
  </details>

  <details open="">
    <summary>Text Sample : Text_Eng.txt and its result</summary>

  ```txt
  As my soul heals the shame
  I will grow through this pain
  Lord, I'm doing all I can
  To be a better man

  ```
  ※ Source : Robbie Williams / Better Man (2001)
  ```
  Number of characters : 0
  Number of words      : 23
  Number of lines      : 4
  ```
  It couldn't count charaters.
  </details>

  <details open="">
    <summary>Text Sample : Text_Kor.txt and its result</summary>

  ```txt
  꿈만큼 이룰 거에요
  너무 늦었단 말은 없어요
  그대를 지켜 주는 건 그대 안에 있어요
  강해져야만 해요
  그것만이 언제나 내 바램이죠

  ```
  ※ Source : 권진원 / 진심 (2003)
  ```
  Number of characters : 0
  Number of words      : 1
  Number of lines      : 5
  ```
  Even counting words is also failed in Korean.
  </details>