# Browser Refresh


### \<List>

- [Browser Refresh (2022.09.03)](#browser-refresh-20220903)


## [Browser Refresh (2022.09.03)](#list)

- Click infinitely to the *refresh* button on the *Edge* browser with `Ctrl`+`Shift`+`j`
- Stop the loop with `Ctrl`+`Shift`+`k`
- It is crazy to avoid the existing hot keys.

#### `BrowserRefresh.ahk`
```ahk
CoordMode, Mouse, Screen
```
```ahk
^+j::
    stop := false
    while (stop == false)
    {
        Click 1992, 52
        Sleep, 1000 * 60                ; 1 minute
        ; Sleep, 1000 * 3               ; 3 seconds - for test
    }
    return
```
```ahk
^+k::
    stop := true
    MsgBox, The loop stopped.
    return
```