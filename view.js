const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 100;
canvas.width = canvas.height * 2;
var depth = canvas.height / 2;

alert("YOU NEED TO DRAG AND DROP THE BUILD FILE TO VIEW IT!\n\nCONTROLS ARE IN THE TUTORIAL!");

var distance = (x0,y0,x2,y2) => {
    //d=√((x_2-x_0)²+(y_2-y_0)²)
    return Math.sqrt((x2-x0)**2+(y2-y0)**2);
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
var mapxsize = 10;
var mapysize = 10;
var mapzsize = 10;
var map = array3D(mapxsize,mapysize,mapzsize);

for(let i = 0; i < mapzsize; i++) {
    for(let j = 0; j < mapysize; j++) {
        for(let k = 0; k < mapxsize; k++) {
            if(RB(1,10) == 1) map[i][j][k] = 1;
        }
    }
}


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
            let count = 0;
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
            let accuracy = 3;
            let maxc = 50 * accuracy;
            while(true) {
                x += xs / accuracy;
                y += ys / accuracy;
                z += zs / accuracy;
                count++;
                if(map[Math.floor(z)]?.[Math.floor(y)]?.[Math.floor(x)] === 1) {
                    let borderx = Math.ceil(x) - x;
                    let bordery = Math.ceil(y) - y;
                    let borderz = Math.ceil(z) - z;
                    let bordermin = 0.4;
                    let bordermax = 1 - bordermin;
                    if((borderx < bordermin || borderx > bordermax) && (bordery < bordermin || bordery > bordermax) && (borderz < bordermin || borderz > bordermax)) {
                        ctx.fillStyle = "grey";
                    } else ctx.fillStyle = "white";
                    ctx.globalAlpha = 1 - (count / maxc);
                    ctx.fillRect(canvas.width - j,canvas.height - i,1,1);
                    break;
                } else if(count >= maxc) break; //|| (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height || z < 0 || z >= depth) just in case I need to use this
            }
        }
    }
    setTimeout(() => {
        dframecheck = 0;
    }, 1000 / 30)
}

var player1 = new player(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2),Math.floor(depth / 2));

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

// Function to read and process the JSON file
function process3DArrayFromFile(file) {
	const reader = new FileReader();
	reader.onload = function(event) {
		try {
			// Parse the JSON data
			const jsonData = JSON.parse(event.target.result);

			// Ensure the data is a 3D array
			if (!Array.isArray(jsonData)) {
				console.error("Invalid JSON data format.");
				return;
			}

			//I added so that the build size changes with build file imported
			mapxsize = 0;
			for(let i = 0; i < jsonData[0][0].length; i++) {
				if(jsonData[0][0][i] > 0) mapxsize++;
			}
			mapysize = mapxsize / 2;
            mapzsize = mapysize;
            player1.x = -10;
            player1.y = mapysize / 2;
            player1.z = 0;
            map = [];
            map = array3D(mapxsize,mapysize,mapzsize);
            viewy = 1;
            viewx = 0;

			// Iterate through the 3D array and process data
			for (let z = 0; z < jsonData.length; z++) {
				for (let y = 0; y < jsonData[z].length; y++) {
					for (let x = 0; x < jsonData[z][y].length; x++) {
						//this is my own code
						index = jsonData[z][y][x];
						if(index === 1) {
							map[z][y][x] = 1;
						} else if(index === 3) { //1x1x3
							map[z][y][x] = 1;
							map[z][y][x - 1] = 1;
							map[z][y][x + 1] = 1;
						} else if(index === 4) { //1x3x1
							map[z][y][x] = 1;
							map[z][y - 1][x] = 1;
							map[z][y + 1][x] = 1;
						} else if(index === 5) { //3x1x1
							map[z][y][x] = 1;
							map[z - 1][y][x] = 1;
							map[z + 1][y][x] = 1;
						} else if(index === 6) { //1x3x3
							for(let dy = -1; dy <= 1; dy++) {
								for(let dx = -1; dx <= 1; dx++) {
									map[z][y + dy][x + dx] = 1;
								}
							}
						} else if(index === 7) { //3x1x3
							for(let dz = -1; dz <= 1; dz++) {
								for(let dx = -1; dx <= 1; dx++) {
									map[z + dz][y][x + dx] = 1;
								}
							}
						} else if(index === 8) { //3x3x1
							for(let dz = -1; dz <= 1; dz++) {
								for(let dy = -1; dy <= 1; dy++) {
									map[z + dz][y + dy][x] = 1;
								}
							}
						} else if(index === 9) { //3x3x3
							for(let dz = -1; dz <= 1; dz++) {
								for(let dy = -1; dy <= 1; dy++) {
									for(let dx = -1; dx <= 1; dx++) {
										map[z + dz][y + dy][x + dx] = 1;
									}
								}
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