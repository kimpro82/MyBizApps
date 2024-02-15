# [Lottery Number Generator (R)](../../README.md#r)

COBOL never dies


### \<List>

- [Lottery Number Generator (2024.02.15)](#lottery-number-generator-20240215)


## [Lottery Number Generator (2024.02.15)](#list)

- Features
  - Generate Lottery numbers for *Korean Lotto 6/45* by randomly selecting 6 unique numbers between 1 and 45
  - Suggest additionally a fortune number
  - Sort the outputs as ascending order and display them vertically
- Don't worry, I understand enough that Lottery numbers are highly random
- Future Improvements
  - Migrate to a GUI-based approach with other languages including web languages
- Code and Results
  <details>
    <summary>Code : Lotto.r</summary>

  ```r
  BALLS = 45
  CHOOSE = 6
  PURCHASE = 20
  ```
  ```r
  for (i in 1:PURCHASE) {
      while (TRUE) {
          # Generate 6 random numbers between 1 and 42
          nums <- c(sort(ceiling(runif(CHOOSE) * BALLS)))
          luckyNum <- ceiling(runif(1) * BALLS)
          # Check if there are exactly 6 unique numbers and luckyNum is not in nums
          if (!any(duplicated(nums)) && !any(luckyNum %in% nums)) {
              break;
          }
      }

      # Print the selected numbers with fixed width
      for (j in 1:CHOOSE) {
          cat(sprintf("%2d ", nums[j]))
      }
      cat("/", sprintf("%2d", luckyNum), "\n")
  }
  ```
  </details>

  <details open="">
    <summary>Results</summary>

  ```txt
   7 19 22 31 40 43 / 12 
   6  7 17 21 31 41 / 39 
  11 13 18 25 29 33 / 17 
   3 15 33 40 42 43 / 37 
  13 17 20 24 33 38 / 36 
   2  5  8 11 15 21 / 22 
   2  5 16 22 34 43 /  8 
   2  5  6 18 23 32 /  4 
   9 17 23 24 39 40 / 31 
   9 10 24 38 39 41 / 35 
   2 15 17 20 28 29 / 26 
  13 19 25 36 38 40 / 16 
   6 13 17 29 31 38 / 43 
   5  9 13 19 21 42 / 37 
   5 10 13 32 37 45 / 12 
   3 13 18 32 34 41 / 35 
   5  6 10 11 17 24 / 41 
   7 10 25 37 41 45 / 14 
   3 15 19 21 42 45 /  2 
   8  9 22 29 37 39 /  4 
  ```
  </details>
