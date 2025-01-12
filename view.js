const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 100;
canvas.width = canvas.height * 2;
var depth = canvas.height / 2;

alert("YOU NEED TO DRAG AND DROP THE BUILD FILE TO VIEW IT!\n\nCONTROLS ARE IN THE TUTORIAL!\n\n(I am sorry if this build viewer is shit because I dont know enough math yet)");

var distance = (x0,y0,x2,y2) => {
    //d=√((x_2-x_0)²+(y_2-y_0)²)
    return Math.sqrt((x2-x0)**2+(y2-y0)**2);
}
var distance3D = (x0,y0,z0,x2,y2,z2) => {
    //d=√((x_2-x_0)²+(y_2-y_0)²)
    return Math.sqrt((x2-x0)**2+(y2-y0)**2+(z2-z0)**2);
}
var test = (x,y,x2,y2,XorY) => {
    let aX = x - x2;
    let aY = y - y2;
    let sumX = 0 - aX;
    let sumY = 0 - aY;
    let division = (Math.abs(aX) + Math.abs(aY));
    if(XorY == "X") {
        return sumX / division;
    } else if(XorY == "Y") {
        return sumY / division;
    }
}

var where = (max,value,max2) => {
    return (value / max) * max2;
}

var test3D = (x,y,z,x2,y2,z2,XorYorZ) => {
    let aX = x - x2;
    let aY = y - y2;
    let aZ = z - z2;
    let sumX = 0 - aX;
    let sumY = 0 - aY;
    let sumZ = 0 - aZ;
    let division = (Math.abs(aX) + Math.abs(aY) + Math.abs(aZ));
    if(XorYorZ == "X") {
        return sumX / division;
    } else if(XorYorZ == "Y") {
        return sumY / division;
    } else if(XorYorZ == "Z") {
        return sumZ / division;
    }
}

function RB(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const array3D = (x, y, z) => {
    const array = [];
    for (let i = 0; i < z; i++) {
        array[i] = [];
        for (let j = 0; j < y; j++) {
            array[i][j] = [];
            for (let k = 0; k < x; k++) {
                array[i][j][k] = 0;
            }
        }
    }
    return array;
}
var mapxsize = 4;
var mapysize = 2;
var mapzsize = 2;
var map = array3D(mapxsize,mapysize,mapzsize);

map[0][0][0] = 1;


var mouse = {
    x: 0,
    y: 0
}

class player {
	constructor(x,y,z) {
		this.x = x;
		this.y = y;
        this.z = z;
	}
}

addEventListener("mousemove", (e) => {
        mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
        mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
})

var keys = [];
var dframecheck = 0;
var viewx = 0; //Yeah im sorry I dont know how to do 3d angles and this may be inefficient but this is also my first time coding something like this. Atleast it works!
var viewy = 1;
/*
viewx0 = front
viewx1 = left
viewx2 = back
viewx3 = right

viewy0 = up
viewy1 = viewx
viewy2 = down
*/
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';
    let increment = 0.5;
    let speedX = 0;
    let speedY = 0
    let speedZ = 0;
    if(dframecheck == 0) {
        //uhh yeah maybe inefficient shitty code (I need to learn more math) probably confusing for the user (troll)
        if(keys[68]) {//d
            if(viewy == 1) {
                if(viewx == 0) {
                    speedY = -1 * increment;
                } else if(viewx == 1) {
                    speedX = 1 * increment;
                } else if(viewx == 2) {
                    speedY = 1 * increment;
                } else if(viewx == 3) {
                    speedX = -1 * increment;
                }
            } else if(viewy == 0) {
                speedX = -1 * increment;
            } else if(viewy == 2) {
                speedX = -1 * increment;
            }
            keys[68] = 0;
        }
        if(keys[39]) { //right arrow
            viewy = 1;
            switch(viewx) {
                case 0:
                    viewx = 3;
                break;
                case 1:
                    viewx = 0;
                break;
                case 2:
                    viewx = 1;
                break;
                case 3:
                    viewx = 2;
                break;
            }
            keys[39] = 0;
        }
        if(keys[65]) {//a
            if(viewy == 1) {
                if(viewx == 0) {
                    speedY = 1 * increment;
                } else if(viewx == 1) {
                    speedX = -1 * increment;
                } else if(viewx == 2) {
                    speedY = -1 * increment;
                } else if(viewx == 3) {
                    speedX = 1 * increment;
                }
            } else if(viewy == 0) {
                speedX = 1 * increment;
            } else if(viewy == 2) {
                speedX = 1 * increment;
            }
            keys[65] = 0;
        }
        if(keys[37]) { //left arrow
            viewy = 1;
            switch(viewx) {
                case 0:
                    viewx = 1;
                break;
                case 1:
                    viewx = 2;
                break;
                case 2:
                    viewx = 3;
                break;
                case 3:
                    viewx = 0;
                break;
            }
            keys[37] = 0;
        }
        if(keys[87]) {//w
            if(viewy == 1) {
                if(viewx == 0) {
                    speedX = 1 * increment;
                } else if(viewx == 1) {
                    speedY = 1 * increment;
                } else if(viewx == 2) {
                    speedX = -1 * increment;
                } else if(viewx == 3) {
                    speedY = -1 * increment;
                }
            } else if(viewy == 0) {
                speedZ = 1 * increment;
            } else if(viewy == 2) {
                speedZ = -1 * increment;
            }
                keys[87] = 0;
        }
        if(keys[38]) { //up arrow
            viewy--;
            if(viewy < 0) viewy = 2;
            keys[38] = 0;
        }
	if(keys[83]) { //s
		if(viewy == 1) {
            if(viewx == 0) {
                speedX = -1 * increment;
            } else if(viewx == 1) {
                speedY = -1 * increment;
            } else if(viewx == 2) {
                speedX = 1 * increment;
            } else if(viewx == 3) {
                speedY = 1 * increment;
            }
        } else if(viewy == 0) {
            speedZ = -1 * increment;
        } else if(viewy == 2) {
            speedZ = 1 * increment;
        }
		keys[83] = 0;
	}
    if(keys[40]) { //down arrow
        viewy++;
        if(viewy > 2) viewy = 0;
        keys[40] = 0;
    }
    if(keys[69]) { //e
        if(viewy == 1) {
            speedZ = 1 * increment;
        } else if(viewy == 2) {
            speedY = -1 * increment;
        } else if(viewy == 0) {
            speedY = 1 * increment;
        }
        keys[69] = 0;
    }
    if(keys[67]) { //c
        if(viewy == 1) {
            speedZ = -1 * increment;
        } else if(viewy == 2) {
            speedY = 1 * increment;
        } else if(viewy == 0) {
            speedY = -1 * increment;
        }
        keys[67] = 0;
    }
    player1.x += speedX;
    player1.y += speedY;
    player1.z += speedZ;
    drawing();
}
}


var drawing = () => {
    if(dframecheck == 1) return 0;
    dframecheck = 1;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(let i = 0; i < canvas.height; i++) {
        for(let j = 0; j < canvas.width; j++) {


            let x = player1.x;
            let y = player1.y;
            let z = player1.z;
            let ii = canvas.height / -2 + i;
            let jj = canvas.width / -2 + j;
            let ojj = canvas.width / -2 + canvas.width - 1 - j;
            let oii = canvas.height / -2 + canvas.height - 1 - i;
            let fov = canvas.height;
            let xs = 0;
            let ys = 0;
            let zs = 0;
            //this test3d function is just something I wrote after thinking a bit how to move to another coordinate in a straight line one bit at a time (I dont know 3d angles)
            if(viewy == 1) { //watdasigma IS THIS TRASH AND INEFFICIENT?
                if(viewx == 0) { //front
                    xs = test3D(x,y,z,x + fov,y + jj, z + ii,"X");
                    ys = test3D(x,y,z,x + fov,y + jj, z + ii,"Y");
                    zs = test3D(x,y,z,x + fov,y + jj, z + ii,"Z");
                    document.title = "FRONT";
                } else if(viewx == 1) { //left
                    xs = test3D(x,y,z,x + ojj,y + fov, z + ii,"X");
                    ys = test3D(x,y,z,x + ojj,y + fov, z + ii,"Y");
                    zs = test3D(x,y,z,x + ojj,y + fov, z + ii,"Z");
                    document.title = "LEFT";
                } else if(viewx == 2) { //back
                    xs = test3D(x,y,z,x - fov,y + ojj, z + ii,"X");
                    ys = test3D(x,y,z,x - fov,y + ojj, z + ii,"Y");
                    zs = test3D(x,y,z,x - fov,y + ojj, z + ii,"Z");
                    document.title = "BACK";
                } else if(viewx == 3) { //right
                    xs = test3D(x,y,z,x + jj,y - fov, z + ii,"X");
                    ys = test3D(x,y,z,x + jj,y - fov, z + ii,"Y");
                    zs = test3D(x,y,z,x + jj,y - fov, z + ii,"Z");
                    document.title = "RIGHT";
                }
            } else if(viewy == 0) { //up
                document.title = "UP";
                xs = test3D(x,y,z,x + jj,y + ii, z + fov,"X");
                ys = test3D(x,y,z,x + jj,y + ii, z + fov,"Y");
                zs = test3D(x,y,z,x + jj,y + ii, z + fov,"Z");
            } else if(viewy == 2) { //down
                document.title = "DOWN";
                xs = test3D(x,y,z,x + jj,y + oii, z - fov,"X");
                ys = test3D(x,y,z,x + jj,y + oii, z - fov,"Y");
                zs = test3D(x,y,z,x + jj,y + oii, z - fov,"Z");
            }
            let xs2 = xs;
            let ys2 = ys;
            let zs2 = zs;
            let maxd = 15;
            let c = 0;
            let c2 = 0;
            let maxc = 100;
            let maxc2 = maxc * 3;
            let accuracy = 0.5;
            let acount = 0; //inspired from DDA algorithm (maybe its stupid that I look 1 axis at a time but hey atleast it is faster and more accurate than incrementing 1 bit at a time)
            /*
            0 = x
            1 = y
            2 = z
            */
           let rx = Math.floor(x);
           let ry = Math.floor(y);
           let rz = Math.floor(z);
           let ld = maxd * 2;
           let lx = x;
           let ly = y;
           let lz = z;
            bigone:
            while(true) {
                c2++;
                if(c2 > maxc2) break bigone;
                switch(acount) {
                    case 0: //x
                            if(xs > 0) {
                                if(Math.floor(x) - x == 0) {
                                    xs2 = accuracy * 2;
                                } else {
                                    xs2 = accuracy;
                                }
                            } else {
                                if(Math.floor(x) - x == 0) {
                                    xs2 = accuracy * -2;
                                } else {
                                    xs2 = accuracy * -1;
                                }
                            }
                            
                        ys2 = xs2 * (ys / xs);
                        zs2 = xs2 * (zs / xs);
                    break;
                    case 1: //y
                        if(ys > 0) {
                            if(Math.floor(y) - y == 0) {
                                ys2 = accuracy * 2;
                            } else {
                                ys2 = accuracy;
                            }
                        } else {
                            if(Math.floor(y) - y == 0) {
                                ys2 = accuracy * -2;
                            } else {
                                ys2 = accuracy * -1;
                            }
                        }
                        xs2 = ys2 * (xs / ys);
                        zs2 = ys2 * (zs / ys);
                    break;
                    case 2: //z
                           if(zs > 0) {
                            if(Math.floor(z) - z == 0) {
                                zs2 = accuracy * 2;
                            } else {
                                zs2 = accuracy;
                            }
                           } else {
                            if(Math.floor(z) - z == 0) {
                                zs2 = accuracy * -2;
                            } else {
                                zs2 = accuracy * -1;
                            }
                           }
                        xs2 = zs2 * (xs / zs);
                        ys2 = zs2 * (ys / zs);
                    break;
                }
                x += xs2;
                y += ys2;
                z += zs2;
                if(xs > 0) {
                    rx = Math.floor(x);
                } else rx = Math.ceil(x - 1);
                if(ys > 0) {
                    ry = Math.floor(y);
                } else ry = Math.ceil(y - 1);
                if(zs > 0) {
                    rz = Math.floor(z);
                } else rz = Math.ceil(z - 1);
                c++;
                let d = Math.abs(distance3D(player1.x,player1.y,player1.z,x,y,z));
                if(map[rz]?.[ry]?.[rx] === 1 || (acount == 4 && ld < maxd)) {
                    if(d <= ld && acount <= 3) {
                        ld = d;
                        lx = x;
                        ly = y;
                        lz = z;
                    }

                    c = 0;
                    x = player1.x;
                    y = player1.y;
                    z = player1.z;
                    xs2 = xs;
                    ys2 = ys;
                    zs2 = zs;

                    if(acount >= 3 && ld < maxd) {
                    let borderx = Math.ceil(lx) - lx;
                    let bordery = Math.ceil(ly) - ly;
                    let borderz = Math.ceil(lz) - lz;
                    let bordermin = 0.4;
                    let bordermax = 1 - bordermin;
                    if((borderx < bordermin || borderx > bordermax) && (bordery < bordermin || bordery > bordermax) && (borderz < bordermin || borderz > bordermax)) {
                        ctx.fillStyle = "grey";
                    } else ctx.fillStyle = "white";
                    ctx.globalAlpha = 1 - (ld / maxd);
                    ctx.fillRect(canvas.width - j,canvas.height - i,1,1);
                    break bigone;
                }
                acount++;
                } else if(d >= maxd || c >= maxc) {
                    acount++;
                    c = 0;
                    x = player1.x;
                    y = player1.y;
                    z = player1.z;
                    xs2 = xs;
                    ys2 = ys;
                    zs2 = zs;
                    if(acount > 4) break bigone;
                }
            }
        }
    }
    setTimeout(() => {
        dframecheck = 0;
    }, 1000 / 30)
}

var player1 = new player(-10, Math.floor(mapysize / 2),0);

//yeah I used AI for all this file stuff

 // Prevent default behavior for drag-and-drop events
 window.addEventListener('dragover', (event) => {
	event.preventDefault();
});

window.addEventListener('drop', (event) => {
	event.preventDefault();

	// Check if there is a file being dropped
	if (event.dataTransfer && event.dataTransfer.files.length > 0) {
		const file = event.dataTransfer.files[0];
		if (file.type === "application/json") {
			//this is my own code
			map = array3D(canvas.height,canvas.width,depth);
			// Call the function to process the file
			process3DArrayFromFile(file);
		} else {
			console.error("Please drop a valid JSON file.");
		}
	}
});

function decode3(encoded) {
    // Extract the original numbers
    const num1 = (encoded >> 16) & 0xFF; // Get the first 8 bits
    const num2 = (encoded >> 8) & 0xFF;  // Get the next 8 bits
    const num3 = encoded & 0xFF;        // Get the last 8 bits
    return [num1, num2, num3];
}

function isEven(n) {
	return n % 2 == 0;
 }

// Function to read and process the JSON file
function process3DArrayFromFile(file) {
	const reader = new FileReader();
	reader.onload = function(event) {
		try {
			// Parse the JSON data
			const jsonData = JSON.parse(event.target.result);

			// Ensure the data is an array
			if (!Array.isArray(jsonData)) {
				console.error("Invalid JSON data format.");
				return;
			}

			//I added so that the build size changes with build file imported
			mapxsize = jsonData[0];
            mapysize = jsonData[1]
            mapzsize = mapysize;
            player1.x = -10;
            player1.y = Math.floor(mapysize / 2);
            player1.z = 0;
            map = array3D(mapxsize,mapysize,mapzsize);
            viewy = 1;
            viewx = 0;

			for(let i = 2; i < jsonData.length; i++) {
				if(isEven(i + 1)) { //plus one to match the AHK array index so I dont confuse myself
					let xyz = decode3(jsonData[i]);
					let xyzSize = decode3(jsonData[i - 1]);
					let sx = (xyzSize[0] - 1) / 2;
					if(sx < 0) sx = 0;
					let sy = (xyzSize[1] - 1) / 2;
					if(sy < 0) sy = 0;
					let sz = (xyzSize[2] - 1) / 2;
					if(sz < 0) sz = 0;
					console.log("POSITION: X" + xyz[0] + "Y" + xyz[1] + "Z" + xyz[2] + "\nSIZE: X" + xyzSize[0] + "Y" + xyzSize[1] + "Z" + xyzSize[2]);
					for(let z = sz * -1; z <= sz; z++) {
						for(let y = sy * -1; y <= sy; y++) {
							for(let x = sx * -1; x <= sx; x++) {
								map[xyz[2] + z][xyz[1] + y][xyz[0] + x] = 1;
							}
						}
					} 
				}
			}

		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	};
	reader.readAsText(file);
	setTimeout(() => {
        drawing();
    },1000)
}


drawing();
