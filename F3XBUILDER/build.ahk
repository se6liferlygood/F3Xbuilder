global xx := 0
global xy := 0
global yx := 0
global yy := 0
global zx := 0
global zy := 0
global cx := 0
global cy := 0
global ping := 100
global time := 25
global resetcount := 0

!x:: {
    MouseGetPos &xpos, &ypos
    global xx := xpos
    global xy := ypos
    MsgBox("X: X" xx " Y" xy)
}

!y:: {
    MouseGetPos &xpos, &ypos
    global yx := xpos
    global yy := ypos
    MsgBox("Y: X" yx " Y" yy)
}

!z:: {
    MouseGetPos &xpos, &ypos
    global zx := xpos
    global zy := ypos
    MsgBox("Z: X" zx " Y" zy)
}

!c:: {
    MouseGetPos &xpos, &ypos
    global cx := xpos
    global cy := ypos
    MsgBox("COPY: X" xx " Y" xy)
}

copy() {
    Send("+{c}")
    Sleep ping
}

movebrick(x,y,z) {
    while A_IsSuspended {
        Sleep 1000
    }
    global xx
    global xy
    global yx
    global yy
    global zx
    global zy
    speed := 100
    times := 2
    movesleep := 5
    global ping
    pingsleep := ping + ping / 2

    Send("z")
    Sleep time


    loop times {
    Sleep movesleep
    MouseMove(xx + 1,xy + 1,speed)
    Sleep movesleep
    MouseMove(xx,xy,speed)
    }
    Sleep time
    MouseMove(xx + 1,xy + 1,speed)
    Sleep time
    MouseClick("Left")
    Sleep time
    SendText("" x)
    Sleep pingsleep
    

    loop times {
    Sleep movesleep
    MouseMove(yx + 1,yy + 1,speed)
    Sleep movesleep
    MouseMove(yx,yy,speed)
    }
    Sleep time
    MouseMove(yx + 1,yy + 1,speed)
    Sleep time
    MouseClick("Left")
    Sleep time
    SendText("" y)
    Sleep pingsleep
    

    loop times {
    Sleep movesleep
    MouseMove(zx + 1,zy + 1,speed)
    Sleep movesleep
    MouseMove(zx,zy,speed)
    }
    Sleep time
    MouseMove(zx + 1,zy + 1,speed)
    Sleep time
    MouseClick("Left")
    Sleep time
    SendText("" z)
    Sleep pingsleep

    Send("{Enter}")
    Sleep time
}

resize(xsize, ysize, size) {
    movebrick("-1e6","-1e6","-1e6")
    global xx
    global xy
    global yx
    global yy
    global zx
    global zy
    speed := 100
    times := 3
    rtime := 35
    global ping
    pingsleep := ping * 2

    MouseMove(0,0,speed)
    Sleep rtime
    Send("x")
    Sleep rtime


    loop times {
    Sleep rtime
    MouseMove(xx + 1,xy + 1,speed)
    Sleep rtime
    MouseMove(xx,xy,speed)
    }
    Sleep rtime
    MouseMove(xx + 1,xy + 1,speed)
    Sleep rtime
    MouseClick("Left")
    Sleep rtime
    SendText("" xsize)
    Sleep pingsleep
    
    MouseMove(0,0,speed)
    Sleep rtime

    loop times {
    Sleep rtime
    MouseMove(yx + 1,yy + 1,speed)
    Sleep rtime
    MouseMove(yx,yy,speed)
    }
    Sleep rtime
    MouseMove(yx + 1,yy + 1,speed)
    Sleep rtime
    MouseClick("Left")
    Sleep rtime
    SendText("" ysize)
    Sleep pingsleep
    

    MouseMove(0,0,speed)
    Sleep rtime

    loop times {
    Sleep rtime
    MouseMove(zx + 1,zy + 1,speed)
    Sleep rtime
    MouseMove(zx,zy,speed)
    }
    Sleep rtime
    MouseMove(zx + 1,zy + 1,speed)
    Sleep rtime
    MouseClick("Left")
    Sleep rtime
    SendText("" size)
    Sleep pingsleep

    MouseMove(0,0,speed)
    Sleep rtime
    Send("{Enter}")
    Sleep rtime
}

global width := 0
JsonToObj(JsonString) {
    global width := 0
    wcheck := 0
    ; Check if the input string is valid
    if (JsonString == "") {
        MsgBox("Error: Empty JSON string provided.")
        return []  ; Return an empty array
    }

    ; Remove whitespace characters
    JsonString := StrReplace(JsonString, " ", "")
    JsonString := StrReplace(JsonString, "`t", "")  ; Remove tabs
    JsonString := StrReplace(JsonString, "`n", "")  ; Remove new lines

    ; Initialize the main 3D array
    local MainArray := []

    ; Remove outer brackets and split the string into top-level arrays
    JsonString := SubStr(JsonString, 2, StrLen(JsonString) - 2)  ; Remove the outer brackets
    local TopLevelArrays := StrSplit(JsonString, "],[")

    for TopLevelArray in TopLevelArrays {
        ; Clean up the array string
        TopLevelArray := StrReplace(TopLevelArray, "[", "")  ; Remove opening bracket
        TopLevelArray := StrReplace(TopLevelArray, "]", "")  ; Remove closing bracket

        ; Initialize a 2D array
        local TwoDArray := []

        ; Split into individual rows
        local Rows := StrSplit(TopLevelArray, "],[")

        for Row in Rows {
            ; Clean up the row string
            Row := StrReplace(Row, "[", "")
            Row := StrReplace(Row, "]", "")

            ; Split into individual elements and convert to numbers
            local Elements := StrSplit(Row, ",")
            local RowArray := []
            for Element in Elements {
                RowArray.Push(Number(Element))  ; Convert to integer and add to the row array
                if(Number(Element) > 0 && wcheck = 0) {
                    width++
                }
            }
            if(width > 0) {
                wcheck := 1
            }
            TwoDArray.Push(RowArray)  ; Add the row to the 2D array
        }
        MainArray.Push(TwoDArray)  ; Add the 2D array to the main 3D array
    }

    return MainArray  ; Return the constructed 3D array
}

clear() {
    Send("/")
    Sleep time
    SendText("/clear")
    Sleep time
    Send("{Enter}")
    Sleep time
}

global building := 0
global f3xstr := "BUILDING!`n`nHOLD B TO CANCEL BUILDING!`n`nYOU CAN PRESS ALT I TO CHAT OR ALT P TO PAUSE!"

build(checks, pi, f, x, y, z, sz) {
    if(!(WinActive("Roblox") || WinActive("RobloxPlayerBeta") || WinActive("Roblox.exe"))) {
        MsgBox("THIS ONLY WORKS IN ROBLOX!`n`n(try to build again in roblox)")
        return 0
    }
    global f3xstr
    logicstr := ""
    global xx
    global xy
    global yx
    global yy
    global zx
    global zy
    global resetcount
    if(xx = 0 || xy = 0 || yx = 0 || yy = 0 || zx = 0 || zy = 0) {
        MsgBox("YOU MUST DEFINE WHERE X AND Y AND Z AXIS IS!")
        return 0
    }
    if(checks = 0) {
    global ping := InputBox("TYPE IN YOUR AVARAGE PING!").value
    ; Get input values
    x := InputBox("X").value
    y := InputBox("Y").value
    z := InputBox("Z").value
    size := InputBox("size").value
    str := InputBox("BUILD FILE").value ".json"
    } else {
        global ping := pi
        str := f
        x := x
        y := y
        z := z
        size := sz
    }
    if(size >= 2048 / 3) {
      size := Floor(2048 / 3)
    }
    ; Read the JSON data from the specified file
    json := FileRead(str)
    
    ; Convert JSON data back to a 3D array in AHK
    array3D := JsonToObj(json)

    Sleep time

    ; Show a building notification
    ToolTip(f3xstr, A_ScreenWidth / 2, A_ScreenHeight / 2)
    global building := 1


    cubesize := 1
    xcubesize := 0
    ox := x
    oz := z
    oz1 := z + 1
    ox1 := x + 1
    loopcountz := 0
    zcubesize := 0
    zbuilding := 0
    buildcount := 0
    skipcount := 0

    global width
    length := width / 2


    while (checks = 1 || checks = 0) {
        if(f = "loopmaze.json") {
            str := "loopmaze" Random(1,5) ".json"
            json := FileRead(str)
            array3D := JsonToObj(json)
        }
        if((checks = 1 && (zbuilding = 1 && zcubesize >= loopcountz - 1)) || (checks = 1 && buildcount = 6)) {
            if(buildcount != 6) {
                x := x - length * size
            }
            skipcount := skipcount + 1
            goto skip
        }
    clear()
    copy()
    movebrick("-1e6","-1e6","-1e6")
    clear()
    resize(size,size,size)
    Sleep time * 2


    brickcount := 0
    currentbricks := 0
    percentagewise := 0
    percentage := 0
    loop 9 {
        if(GetKeyState("b","P")) {
            building := 0
            ToolTip()
            return 0
        }
        check := 1
        check2 := 0
        squish := 0
        addy := 0
        ccount := 0
        xsize := size
        ysize := size
        zsize := size
        currentxsize := xsize
        currentysize := ysize
        currentzsize := zsize
        if(A_Index = 1) {
            indextype := 2
        } else if(A_Index = 2) {
            indextype := 1
        } else {
            indextype := A_Index
        }
        if(indextype = 3) {
            xsize := xsize * 3
        } else if(indextype = 4) {
            xsize := size
            ysize := ysize * 3
        } else if(indextype = 5) {
            xsize := size
            ysize := size
            zsize := size * 3
        } else if(indextype = 6) {
            zsize := size
            xsize := size * 3
            ysize := size * 3
        } else if(indextype = 7) {
            zsize := size * 3
            xsize := size * 3
            ysize := size
        } else if(indextype = 8) {
            zsize := size * 3
            xsize := size
            ysize := size * 3
        } else if(indextype = 9) {
            xsize := size * 3
            ysize := size * 3
            zsize := size * 3
        }



    ; Iterate over depth, length, and width to access elements
    loop array3D.Length {  ; Loop through actual depth of the array
        if(GetKeyState("b","P")) {
            building := 0
            ToolTip()
            return 0
        }
        zlevel := A_Index  ; 1-based index for depth
        if(check = 1) {
            check := 0
        } else if(check = 0) {
            squish := squish - 1
            check2 := 1
        }
        ; Check if the z-level exists
        if (zlevel <= array3D.Length) {
            loop length {
                if(GetKeyState("b","P")) {
                    building := 0
                    ToolTip()
                    return 0
                }
                ylevel := A_Index  ; 1-based index for length
                ; Check if the y-level exists in the current z-level
                if (ylevel <= array3D[zlevel].Length) {
                    loop width {
                        if(GetKeyState("b","P")) {
                            building := 0
                            ToolTip()
                            return 0
                        }
                        xlevel := A_Index  ; 1-based index for width

                        ; Check if the x-level exists in the current y-level
                        if (xlevel <= array3D[zlevel][ylevel].Length) {


                            index := array3D[zlevel][ylevel][xlevel]
                            ; Check the value at the current index
                            if (index > 0) {
                                if(indextype = 2) {
                                    if(index = 1) {
                                        brickcount++
                                        percentagewise += 1
                                    } else if(index >= 3 && index <= 5) {
                                        brickcount++
                                        percentagewise += 3
                                    } else if(index >= 6 && index <= 8) {
                                        brickcount++
                                        percentagewise += 9
                                    } else if(index = 9){
                                        brickcount++
                                        percentagewise += 27
                                    }
                                } else {

                                check := 1
                                if(check2 = 1) {
                                    check2 := 0
                                    addy++
                                    squish := squish - length
                                }
                                if(index = indextype) {
                                    ccount++
                                    if(ccount >= 3) {
                                        ccount := 0
                                        clear()
                                        Sleep time
                                    }
                                copy()
                                if(indextype > 2) {
                                    if(indextype = 3 && (currentxsize != xsize || currentysize != ysize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        resize(size,size,xsize)
                                    } else if(indextype = 4 && (currentxsize != xsize || currentysize != ysize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        resize(ysize,size,size)
                                    } else if(indextype = 5 && (currentxsize != xsize || currentysize != ysize || currentzsize != zsize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        currentzsize := zsize
                                        resize(size,zsize,size)
                                    } else if(indextype = 6 && (currentxsize != xsize || currentysize != ysize || currentzsize != zsize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        currentzsize := zsize
                                        resize(ysize,size,xsize)
                                    } else if(indextype = 7 && (currentxsize != xsize || currentysize != ysize || currentzsize != zsize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        currentzsize := zsize
                                        resize(size,zsize,xsize)
                                    } else if(indextype = 8 && (currentxsize != xsize || currentysize != ysize || currentzsize != zsize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        currentzsize := zsize
                                        resize(ysize,zsize,size)
                                    } else if(indextype = 9 && (currentxsize != xsize || currentysize != ysize || currentzsize != zsize)) {
                                        currentxsize := xsize
                                        currentysize := ysize
                                        currentzsize := zsize
                                        resize(ysize,zsize,xsize)
                                    }
                                }
                                if(indextype = 1) {
                                    currentbricks++
                                    percentage++
                                } else if(indextype >= 3 && indextype <= 5) {
                                    currentbricks++
                                    percentage += 3
                                } else if(indextype >= 6 && indextype <= 8) {
                                    currentbricks++
                                    percentage += 9
                                } else if(indextype = 9) {
                                    currentbricks++
                                    percentage += 27
                                }
                                logicstr := "`n`nAMOUNT OF BRICKS TO BE PLACED: " brickcount "`n`nCURRENT BRICKS PLACED: " currentbricks "`n`nBUILDING COMPLETION: " Round((percentage / percentagewise) * 100) "%"
                                if(buildcount > 0) {
                                    logicstr := logicstr "`n`nBUILDCOUNT: " buildcount - skipcount
                                }
                                movebrick(x + (zlevel + squish) * size, y + (ylevel + addy) * size,z + xlevel * size)
                                ToolTip(f3xstr logicstr,A_ScreenWidth / 2, A_ScreenHeight / 2)
                                }
                            }
                            } 


                        }
                    }
                }
            }
        }
    }

}
skip:
if(zcubesize < loopcountz) {
    z := z + width * size
    zcubesize := zcubesize + 1
    if(zcubesize >= loopcountz) {
        x := ox
    }
    zbuilding := 1
} else {
if(xcubesize < cubesize) {
    x := x + length * size
    xcubesize := xcubesize + 1
    zbuilding := 0
} else {
    z := z + width * size
    oz1 := z
    ox1 := x
    z := oz
    xcubesize := 0
    cubesize := cubesize + 1
    loopcountz := loopcountz + 1
    zcubesize := 0
    zbuilding := 1
}
}
if(checks = 0) {
    goto out
}
buildcount := buildcount + 1
    }
    out:
    Sleep 1000
    ToolTip()
    building := 0
}

!b:: {
    MsgBox("SINGLE BUILD MODE!")
    build(0,0,0,0,0,0,0)
}

!f:: {
    MsgBox("FOREVER BUILD MODE!")
    global ping := InputBox("TYPE IN YOUR AVARAGE PING!").value
    ; Get input values
    x := InputBox("X").value
    y := InputBox("Y").value
    z := InputBox("Z").value
    size := InputBox("size").value
    str := InputBox("BUILD FILE").value
    str := str ".json"
    build(1,ping,str,x,y,z,size)
    
}

!t:: {
    global time := InputBox("CURRENT TIME DELAY BETWEEN EVERY ACTION IS " time " MILISECONDS CHANGE IT TO SOMETHING ELSE!").value
}

!r:: {
    MsgBox("RELOADED SCRIPT!")
    Reload
}

tutorial() {
    MsgBox("F3X MACRO TUTORIAL!`n`nPRESS CONTROL T TO VIEW TUTORIAL IF YOU NEED TO VIEW IT AGAIN!`n`n`n`nTHESE ARE THE STEPS YOU NEED TO DO BEFORE YOU CAN START BUILDING!`n`n1. HAVE A FRESH F3X WITH NO GUI MOVED!`n`n2. PRESS Z WHILE HOLDING F3X THEN HOLD YOUR MOUSE OVER THE X AXIS BOX AND PRESS ALT X`n`n3. HOLD YOUR MOUSE OVER THE Y AXIS BOX AND PRESS ALT Y`n`n4. HOLD YOUR MOUSE OVER THE Z AXIS BOX AND PRESS ALT Z`n`n5. DISABLE SHIFTLOCK IN SETTINGS!`n`n`n`nKEYS!`n`nPRESS ALT B TO BUILD A SINGLE BUILD!`n`nPRESS ALT F TO KEEP ON BUILDING FOREVER!`n`nTO BUILD YOU MUST FIRST HAVE A BRICK SELECTED!`n`nPRESS CONTROL E TO EXIT THIS MACRO!`n`nTHIS ONLY WORKS ON ENGLISH KEYBOARD LAYOUT! IF YOU DONT HAVE ENGLISH KEYBOARD LAYOUT YOU CAN CHANGE KEYBOARD SETTINGS TO HAVE IT!")
}

tutorial()

^t:: {
    tutorial()
}

^e:: {
    MsgBox("EXITED F3X BUILDER MACRO!")
    ExitApp
}

#HotIf (building = 1)

!i:: {
    global f3xstr
    ToolTip()
    str := InputBox("TYPE WHAT YOU WANT TO CHAT!").value
    Sleep 500
    Send("/")
    Sleep 500
    SendText(str)
    Sleep 500
    Send("{Enter}")
    Sleep 1000
    ToolTip(f3xstr, A_ScreenWidth / 2, A_ScreenHeight / 2)
}

#SuspendExempt

!p:: { 
	Suspend
    global f3xstr
	if(A_IsSuspended) {
		ToolTip("F3X BUILDING MACRO PAUSED!`n`nDONT DO ANYTHING WITH THE F3X THE MACRO WAS USING!!!`n`nPRESS ALT P TO UNPAUSE AND BUILD AGAIN IF YOU HAVE THE MACRO F3X EQUIPPED!",A_ScreenWidth * 0.1, A_ScreenHeight * 0.1)
	} else {
        ToolTip(f3xstr, A_ScreenWidth / 2, A_ScreenHeight / 2)
    }
}

#SuspendExempt false
