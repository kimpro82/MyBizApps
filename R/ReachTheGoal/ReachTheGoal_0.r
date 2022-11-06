# Simulation how to reach the goal more efficiently
# 2022.10.31


# 0. Practice : Generate a 2d list with sublists that have different lengths to each other

myList <- list()
for (i in 1:10) {
    myList <- c(myList, list(1:i))
}
head(myList)
myList[3]
myList[[3]]