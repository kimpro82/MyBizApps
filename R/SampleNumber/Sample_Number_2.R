# get each branch's sample number

###################################
num = c(2, 10, 30, 50, 100) # input
length(num)

seednum = 0616 # for enhancing objectivity
rate = 0.05 # sampling ratio
###################################

sum = 0
samplenum = c()

for (i in (1:length(num))) {
  if (i == 1) {
    set.seed(seednum)
    samplenum <- c(samplenum,
                   sample(x = 1:num[i], size = ceiling(num[i] * rate), replace = F)
                   ) 
    # at least 1 although num * rate < 1, no duplication
  } else {
    sum = sum + num[i-1]
    set.seed(seednum)
    samplenum <- c(samplenum, 
                   sample(x = (sum+1):(sum+num[i]), size = ceiling(num[i] * rate), replace =F)
                   )  
  }
}

length(samplenum) # length of the sample
print(samplenum) # print without sorting
sort(samplenum) # print with sorting


# test
sum = 0
for (i in (1:length(num))) {
  if (i == 1 ) {
    print(num[i])
  } else {
    sum = sum + num[i-1]
    print(paste(num[i], sum, sum + num[i]))
  }
}

ceiling(3/10) # rounding up