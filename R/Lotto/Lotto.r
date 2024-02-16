# Lottery Number Generator
# 2024.02.15

# This script generates numbers for Korean Lotto 6/45 
# by randomly selecting 6 unique numbers between 1 and 45.
# It repeats the process 20 times and prints the selected numbers.

BALLS = 45
CHOOSE = 6
PURCHASE = 20

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
