# Affection Measurement of TV CFs
# For my frend, JW Park

# 1. Generating Sample Data
n1 = 24*60  # 24 hours * 60 minutes
n2 = 18*60  # not used - suppose 18:00pm is the peak with normal dist.
cf.time = c(6, 12, 18) # suppose cf is played at 6:00, 12:00 and 18:00)
jwp = c("This is", "for my friend", "JW Park") # suprise!

# 1-1. set an uniform dist. frequency of app download
sample.data = runif(10000, 0, n1)/60

# 1-2. add the frequency just after cf
for (i in 1:length(cf.time)) {
  sample.data = c(sample.data, rlnorm(1000, 0, 1) + cf.time[i])
  }
# It can be more plausible with your wit

# 1-3. adjust time ex) 25:00 → 01:00
for (i in 1:length(sample.data)) {
  if (sample.data[i] >= 24) {
    sample.data[i] = sample.data[i] %% 24
  }
}

# 2. plot histogram for comparing before and after ad.
windows(width=12, height=5)
par(mfrow=c(1,3)) 
for (i in 1:length(cf.time)) {
  hist(sample.data, 
       main = jwp[i],
       xlim = range(cf.time[i]-1.5, cf.time[i]+1.5),
       xlab = c("ad at ", cf.time[i]),
       breaks=n1)
}