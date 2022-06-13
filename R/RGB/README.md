# RGB

\* showing RGB color data' distribution by several methods in R


### \<List>

- [RGB (2017.04.14)](#rgb-20170414)


## [RGB (2017.04.14)](#list)
\* using `plot3d()`, converting on coordinate plane  
\* generating RGB data with a sigmoid function

```R
## Install required library packages (only at first)
install.packages("rgl")

## Loading required libraries
library(rgl)
```

#### Generate sample data by Uniform dist.
```R
colors <- matrix(c(runif(3000)), ncol=3)
tail(colors)

plot3d(colors, col=rgb(colors))
```

![RGB_Plotting_2](Images/RGB_Plotting_2.PNG)

#### Using Sigmoid function
Reference : https://en.wikipedia.org/wiki/Sigmoid_function
```R
R <- rnorm(1000, 64, 50)
G <- rnorm(1000, 128, 50)
B <- rnorm(1000, 192, 50)

colors <- (tanh(cbind(R,G,B)/255)+1)/2
summary(colors)

plot3d(colors, col=rgb(colors))
```

![RGB_Plotting_5](Images/RGB_Plotting_5.PNG)

#### Using Sigmoid function 2 (Plotting on coordinate plane)
Reference : https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Conversions/YxyConverter.cs

```R
R2 = R/(R+G+B)
G2 = G/(R+G+B)
B2 = B/(R+G+B)

colors <- (tanh(cbind(R2,G2,B2))+1)/2
summary(colors)

par(mfrow=c(1,3))
plot(colors[,1], colors[,2], col=rgb(colors))
plot(colors[,2], colors[,3], col=rgb(colors))
plot(colors[,3], colors[,1], col=rgb(colors))
```

![RGB_Plotting_6](Images/RGB_Plotting_6.PNG)