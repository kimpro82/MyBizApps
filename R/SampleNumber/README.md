# Sample Number

get each branch's sample number for inspection work


### \<List>

- [Sample Number 2 (2020.06.16)](#sample-number-2-2020616)
- Sample Number (2020.06.10)


## [Sample Number 2 (2020.6.16)](#list)

```R
###################################
num = c(2, 10, 30, 50, 100) # input
length(num)

seednum = 0616 # for enhancing objectivity
rate = 0.05 # sampling ratio
###################################
```
> 5

```R
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
```
> [1] 12  
> [1]   2   4  14  15  74  76  45 124 126 159 167 120  
> [1]   2   4  14  15  45  74  76 120 124 126 159 167


#### Test
```R
sum = 0

for (i in (1:length(num))) {
  if (i == 1 ) {
    print(num[i])
  } else {
    sum = sum + num[i-1]
    print(paste(num[i], sum, sum + num[i]))
  }
}
```
> [1] 2  
> [1] "10 2 12"  
> [1] "30 12 42"  
> [1] "50 42 92"  
> [1] "100 92 192"

```R
ceiling(3/10) # rounding up
```
> 1