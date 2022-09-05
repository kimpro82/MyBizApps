; Browser Refresh
; 2022.09.03

CoordMode, Mouse, Screen

^+j::
    stop := false
    while (stop == false)
    {
        Click 1992, 52
        Sleep, 1000 * 60                ; 1 minute
        ; Sleep, 1000 * 3               ; 3 seconds - for test
    }
    return

^+k::
    stop := true
    MsgBox, The loop stopped.
    return