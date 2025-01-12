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
    MsgBox("X AXIS BOX DEFINED AT SCREEN COORDINATE: X" xx " Y" xy)
}

!y:: {
    MouseGetPos &xpos, &ypos
    global yx := xpos
    global yy := ypos
    MsgBox("Y AXIS BOX DEFINED AT SCREEN COORDINATE: X" yx " Y" yy)
}

!z:: {
    MouseGetPos &xpos, &ypos
    global zx := xpos
    global zy := ypos
    MsgBox("Z AXIS BOX DEFINED AT SCREEN COORDINATE: X" zx " Y" zy)
}

global buildcount := 0
copy() {
    Send("+{c}")
    Sleep ping
    global buildcount := buildcount + 1
}

global edited := 0

global lx := 850938039
global ly := 32975934852
global lz := 255339483085 ;random numbers I wrote its kinda funny lol (serversided f3x coordinate limit is 1 million)
movebrick(x,y,z) {
    while A_IsSuspended {
        Sleep 1000
    }
    global edited
    global xx
    global xy
    global yx
    global yy
    global zx
    global zy
    global lx
    global ly
    global lz
    speed := 100
    times := 2
    movesleep := 5
    global ping
    pingsleep := ping + ping / 2

    if(x = lx && y = ly && z = lz) {
        return 0
    }

    Send("z")
    Sleep time

    if(x != lx) {
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
    lx := x
    edited++
    }
    
    if(y != ly) {
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
    ly := y
    edited++
    }
    
    if(z != lz) {
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
    lz := z
    edited++
    }

    Send("{Enter}")
    Sleep time
}

global lxs := 0
global lys := 0
global lzs := 0
resize(xsize, ysize, size) {
    ;movebrick("-1e6","-1e6","-1e6")
    while A_IsSuspended {
        Sleep 1000
    }

    global edited

    global lxs
    global lys
    global lzs
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

    if(xsize = lxs && ysize = lys && size = lzs) {
        return 0
    }

    Send("x")
    Sleep time

    if(xsize != lxs) {
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
    SendText("" xsize)
    Sleep pingsleep
    lxs := xsize
    edited++
    }

    if(ysize != lys) {
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
    SendText("" ysize)
    Sleep pingsleep
    lys := ysize
    edited++
    }    

    if(size != lzs) {
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
    SendText("" size)
    Sleep pingsleep
    lzs := size
    edited++
    }

    Send("{Enter}")
    Sleep time
}

global width := 0
global buildsize := 0
JsonToObj(JsonString) {
    global buildsize := 0
    barray := []
    tstr := ""
    loop StrLen(JsonString) {
        index := SubStr(JsonString, A_index, 1)
        if(index != "[" && index != "]") {
            if(index = ",") {
                barray.Push(Integer(tstr))
                tstr := ""
            } else {
                tstr := tstr index
            }
        } else if(index = "]") {
            barray.Push(Integer(tstr))
        }
    }
    loop barray.Length / 2 {
        xyz := DecodePackedNumber(barray[A_Index * 2 - 1])
        buildsize += xyz[1] * xyz[2] * xyz[3]
    }
    i := 1
    i2 := i + 2
    done := 0
    a:
    while(true) {
        if(i > barray.Length) {
            break
        }
        i2 := i + 2
        while (done = 0) {
            if(i + 2 >= barray.Length) {
                break a
            } else if(i2 >= barray.Length) {
                break
            }
            if(barray[i2] = barray[i]) {
                pos := barray[i + 1]
                size := barray[i]
                
                barray[i + 1] := barray[i2 + 1]
                barray[i] := barray[i2]

                barray[i2 + 1] := pos
                barray[i2] := size
            }
            i2 += 2
        }
        i += 2
    }
    return barray
}

clear() {
    last := A_Clipboard
    A_Clipboard := "/clear"
    Sleep time
    Send("/")
    Sleep time
    Send("^v")
    Sleep time
    Send("{Enter}")
    Sleep time
    A_Clipboard := last
}

global building := 0
global f3xstr := "BUILDING!`n`nHOLD B TO CANCEL BUILDING!`n`nYOU CAN PRESS ALT P TO PAUSE!"

DecodePackedNumber(encoded) {
    num1 := (encoded >> 16) & 0xFF ; Extract the first 8 bits
    num2 := (encoded >> 8) & 0xFF  ; Extract the second 8 bits
    num3 := encoded & 0xFF         ; Extract the last 8 bits
    return [num1, num2, num3]
}


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
    pos := InputBox("TYPE IN THE COORDINATES WHERE THE BUILD IS TO BE BUILT!`n`n(example if you type in 0 0 0 then it will build at 0 0 0)",,,"0 0 0").Value " "
    tstr := ""
    count := 1
    x := 0
    y := 0
    z := 0
    loop StrLen(pos) {
        index := SubStr(pos, A_index, 1)
        if(index != " ") {
            tstr := tstr index
        } else {
            if(count = 1) {
                x := Integer(tstr)
                tstr := ""
            } else if(count = 2) {
                y := Integer(tstr)
                tstr := ""
            } else {
                z := Integer(tstr)
                tstr := ""
            }
            count++
        }
    }
    ;MsgBox("X" x "Y" y "Z" z)
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
    if(size >= 2048 / 10) {
      size := Floor(2048 / 10)
    }
    ; Read the JSON data from the specified file
    json := FileRead(str)
    
    ; Convert JSON data to instructions for f3x macro
    arrayB := JsonToObj(json)

    mode := 1

    global lx := 321293472598569245
    global ly := 4298373294628342
    global lz := 2487568736587264826589
    global lxs := lx
    global lys := ly
    global lzs := lz
    global edited := 0
    global buildcount := 0
    global buildsize
    currentbuildsize := 0

    Sleep time

    ; Show a building notification
    ToolTip(f3xstr, A_ScreenWidth / 2, A_ScreenHeight / 2)
    global building := 1

    loop arrayB.Length {
        if(GetKeyState("b")) {
            building := 0
            ToolTip()
            return 0
        }
        if(A_Index < 2) {
            A_Index := 2
            continue
        }
        if(mode = 1) {
            mode := 0 ;size uneven index
        } else if(mode = 0) {
            mode := 1 ;position even index
        }
        if(mode = 0) {
            xyz := DecodePackedNumber(arrayB[A_Index])
            resize(xyz[2] * size,xyz[3] * size,xyz[1] * size)
            currentbuildsize += xyz[1] * xyz[2] * xyz[3]
        } else if(mode = 1) {
            xyz := DecodePackedNumber(arrayB[A_Index])
            movebrick(xyz[2] * size + x,xyz[3] * size + y,xyz[1] * size + z)
            if(A_Index != arrayB.Length) {
                copy()
                resetcount++
                if(resetcount >= 5) {
                    resetcount := 0
                    clear()
                }
            }
        }
        if (!A_IsSuspended) {
            ToolTip(f3xstr "`n`nBUILDING COMPLETION: " Round((currentbuildsize / buildsize) * 100,1) "%", A_ScreenWidth / 2, A_ScreenHeight / 2)
        }
    }
    xyz := DecodePackedNumber(arrayB[arrayB.Length])
    movebrick(xyz[2] * size + x,xyz[3] * size + y,xyz[1] * size + z)

    ;MsgBox("" arrayB[arrayB.Length])

    
    Sleep 1000
    ToolTip()
    building := 0
    MsgBox("EDITED COUNT: " edited "`nAMOUNT OF BRICKS: " buildcount)
}

!b:: {
    MsgBox("SINGLE BUILD MODE!")
    build(0,0,0,0,0,0,0)
}

!i:: {
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

^r:: {
    MsgBox("RELOADED SCRIPT!")
    Reload
}

tutorial() {
    MsgBox("F3X MACRO TUTORIAL!`n`nPRESS CONTROL T TO VIEW TUTORIAL IF YOU NEED TO VIEW IT AGAIN!`n`n`n`nTHESE ARE THE STEPS YOU NEED TO DO BEFORE YOU CAN START BUILDING!`n`n1. HAVE A FRESH F3X WITH NO GUI MOVED!`n`n2. PRESS Z WHILE HOLDING F3X THEN HOLD YOUR MOUSE OVER THE X AXIS BOX AND PRESS ALT X`n`n3. HOLD YOUR MOUSE OVER THE Y AXIS BOX AND PRESS ALT Y`n`n4. HOLD YOUR MOUSE OVER THE Z AXIS BOX AND PRESS ALT Z`n`n5. DISABLE SHIFTLOCK IN SETTINGS!`n`n`n`nKEYS!`n`nPRESS ALT B TO BUILD A SINGLE BUILD!`n`nTO BUILD YOU MUST FIRST HAVE A BRICK SELECTED!`n`nPRESS CONTROL E TO EXIT THIS MACRO!`n`nTHIS ONLY WORKS ON ENGLISH KEYBOARD LAYOUT! IF YOU DONT HAVE ENGLISH KEYBOARD LAYOUT YOU CAN CHANGE KEYBOARD SETTINGS TO HAVE IT!")
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
