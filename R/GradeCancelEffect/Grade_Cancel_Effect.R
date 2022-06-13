# 1. generating grade data

# 1.1 grade (4.3 Scale)
g0 <- 1:4
gp <- g0 + 0.3
gm <- g0 - 0.3
g <- sort(c(g0, gp, gm))
g

# 1.2 more compact
g <- sort(c(1:4, 1:4+0.3, 1:4-0.3))
g

# 1.3 test simply matching by slicing
g[9]
g[10]
g[9.5]
g[9.152346]
g[9.876312] # It works but calls values smaller (biased)

# 1.4 generate random grade data
set.seed(307)
평점 <- g[rnorm(30, 9.5, 1.5)]
str(평점)


# 2. plot
len <- length(sort(평점))
windows(width=15, height=8)
  par(mfrow=c(1,2)) 
    hist(평점)
    plot(평점~rank(평점, ties.method="first"),
      xlab = "회색선 : 현재 누적 평점, 빨강선 : 하위 2개 과목 수강취소시 평점, 파랑선 : 하위 5개 과목 수강취소시 평점",
      ylab = "",
      col = c(rep(2,2), rep(4,3), rep(1,len-2-3))[rank(평점, ties.method="first")]
    )
      abline(h=mean((평점), na.rm=TRUE), col="gray")
      abline(h=mean(sort(평점)[3:len]), col="red")
      abline(h=mean(sort(평점)[6:len]), col="blue")

# 2.1 values
mean(평점) # NA. na.rm=TRUE 넣어줘야 함
mean(평점, na.rm=TRUE)
mean(sort(평점)[6:len])
mean(sort(평점)[9:len])


# practice codes

rep("red", 3) # it works?
"red" * 3 # Error : non-numeric argument to binary operator
"red" ** 3 # Error : non-numeric argument to binary operator

c(rep(1,5), rep(2,29))
length(c(rep(1,5), rep(2,29)))

# mean : trim
mean(평점, na.rm=TRUE)
mean(평점, trim = 0.1, na.rm=TRUE)
mean(평점, trim = 0.2, na.rm=TRUE) # trim : 양 옆의 잘라내는 개념이라 의도에 맞지 않음.

sort(평점)
sort(평점)[1] # 1번째 데이터 : [1], [0]이 아님

length(평점)
length(sort(평점))
# default : na.last = NA; NA는 제외

len <- length(sort(평점))
sort(평점)[2:len]

rank(평점, ties.method="first")
# default : ties.method = "average". QQ Plot 이상하게 나옴.