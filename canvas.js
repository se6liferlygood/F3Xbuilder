const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = Number(prompt("BUILD SIZE!\n\nIT IS BEST TO START OUT WITH 5 OR 10 IF IT IS YOUR FIRST TIME!\n\n(TYPE IN A NUMBER)"));
canvas.width = Math.round(canvas.height * (window.innerWidth / window.innerHeight));
depth = canvas.height;
zlevel = 0;
document.title = zlevel + 1;
pause = 0;
timer = 0;
under = 0;
above = 0;
framecheck = 0; //0 is allowed and 1 is wait


function RB(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
var draw = () => {
	if(pause == 0) {
	if(map[zlevel][mouse.y][mouse.x] == 1) {
		map[zlevel][mouse.y][mouse.x] = 2;
	} else map[zlevel][mouse.y][mouse.x] = 1;
	}
}

const array3D = (x, y, z) => {
    const array = [];
    for (let i = 0; i < z + 2; i++) {
        array[i] = [];
        for (let j = 0; j < y + 2; j++) {
            array[i][j] = [];
            for (let k = 0; k < x + 2; k++) {
                array[i][j][k] = 0;
            }
        }
    }
    return array;
}
var map = array3D(canvas.height,canvas.width,depth);

function isEven(n) {
	return n % 2 == 0;
 }

 function decode3(encoded) {
    // Extract the original numbers
    const num1 = (encoded >> 16) & 0xFF; // Get the first 8 bits
    const num2 = (encoded >> 8) & 0xFF;  // Get the next 8 bits
    const num3 = encoded & 0xFF;        // Get the last 8 bits
    return [num1, num2, num3];
}

function encode3(x,y,z) {
	return (x << 16) | (y << 8) | z
}


function encodesize(array, z, y, x,zz,yy,xx) {
	if(array[z + Math.sign(zz)]?.[y]?.[x] != 1 || array[z]?.[y + Math.sign(yy)]?.[x] != 1 || array[z]?.[y]?.[x + Math.sign(xx)] != 1) {
		return false;
	}
	for(let sz = zz * -1; sz <= zz; sz++) {
		for(let sy = yy * -1; sy <= yy; sy++) {
			for(let sx = xx * -1; sx <= xx; sx++) {

				//console.log(`Checking: Z${z + sz}Y${y + sy}X${x + sx}\nSTART: Z${z}Y${y}X${x}`);
				if(array[z + sz]?.[y + sy]?.[x + sx] != 1) {
                    return false;
                }

			}
		}
	}
	//console.log(`FOUND SIZE: Z${zz * 2 + 1}Y${yy * 2 + 1}X${xx * 2 + 1}\nAT: Z${z}Y${y}X${x}`)
	ctx.globalAlpha = (y + x)/(canvas.height + canvas.width) + 0.1;
	for(let sz = zz * -1; sz <= zz; sz++) {
		for(let sy = yy * -1; sy <= yy; sy++) {
			for(let sx = xx * -1; sx <= xx; sx++) {
				ctx.fillStyle = "red"
				ctx.fillRect(x + sx, y + sy,1,1);
				array[z + sz][y + sy][x + sx] = 0;
			}
		}
	}
	ctx.globalAlpha = 1;
	ctx.fillStyle = "blue";
	ctx.fillRect(x,y,1,1);
	return encode3(xx * 2 + 1,yy * 2 + 1,zz * 2 + 1);
}

function out(farray) {
	pause = 1;
	filename = prompt("WHAT NAME WILL THE FILE BE") + ".json";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	let outarray = [canvas.width,canvas.height];
	let xsize = 10;
	let array = JSON.parse(JSON.stringify(farray));
	if(xsize > canvas.width) {
		xsize = canvas.width;
	}
	let ysize = 10;
	if(ysize > canvas.height) {
		ysize = canvas.height;
	}
	let zsize = 10;
	if(zsize < depth) {
		zsize = depth;
	}
	// checking all possible size combinations then turning that size and coordinate it finds into a single number that can be decoded to 3 xyz size numbers (AAAAAAAAA SOOO MANY FOR LOOPS WHAT THE FUCK!)
	let check1 = true;
	let skipped = 0;
	for(let zz = zsize; zz >= 0; zz--) {
		for(let yy = ysize; yy >= 0; yy--) {
			for(let xx = xsize; xx >= 0; xx--) {
				check1 = false;
				for(let z = 0; z < depth; z++) {
					for(let y = 0; y < canvas.height; y++) {
						for(let x = 0; x < canvas.width; x++) {
							if(array[z][y][x] == 1) {
								check1 = true;
								//console.log("Z" + z + "Y" + y + "X" + x);
								let iresult = encodesize(array,z,y,x,zz,yy,xx);
								if(iresult != false) {
									outarray.push(iresult); //encoded size
									outarray.push(encode3(x,y,z)); //encoded position
								}
							}
						}
					}
				}
			}
		}
	}

	let debug = false
	if(debug == false) {
	//json
    // Convert the 3D array to JSON format
    const json = JSON.stringify(outarray);

    // Create a blob and URL for the JSON data
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    // Trigger the download and clean up
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
	} else {
		console.log(outarray);
		console.log("AMOUNT OF BRICKS: " + outarray.length / 2 + "\nAMOUNT OF TIMES SKIPPED: " + skipped);
	}
	setTimeout(() => {
		pause = 0;
		ctx.globalAlpha = 1;
	},1000)
}

var mouse = {
    x: 0,
    y: 0
}

addEventListener("mousemove", (e) => {
	if(pause == 0) {
        mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
        mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
	}
	game();
})
addEventListener("click", (e) => {
	if(pause == 0) {
		draw();
		if(drawingblock == 1) {
			bc[0] = mouse.x;
			bc[1] = mouse.y;
			bc[2] = zlevel;
			drawingblock++;
			alert("CLICK WHERE YOU WANT THE BLOCK AREA TO END!");
		} else if(drawingblock == 2) {
			bc2[0] = mouse.x;
			bc2[1] = mouse.y,
			bc2[2] = zlevel;
			drawingblock = 0;
			drawblock(bc[0],bc[1],bc[2],bc2[0],bc2[1],bc2[2],map,erase);
		}
	}
	game();
})

class stack {
	constructor() {
		this.array = [0];
	}
	push(x) {
		this.array.push(x);
	}
	pop() {
		this.array.pop();
	}
	peek() {
		return this.array[this.array.length - 1];
	}
	empty() {
		this.array = [];
	}
	isempty() {
		if(this.array.length == 0) {
			return true;
		} else return false;
	}
	change(x) {
		this.array[this.array.length - 1] = x;
	}
}

var drawblock = (x,y,z,x2,y2,z2,array,erase) => {
	if(x2 < x) {
		let cx2 = x2;
		let cx = x;
		x2 = cx;
		x = cx2;
	}
	if(y2 < y) {
		let cy2 = y2;
		let cy = y;
		y2 = cy;
		y = cy2;
	}
	if(z2 < z) {
		let cz2 = z2;
		let cz = z;
		z2 = cz;
		z = cz2;
	}
	for(let zz = z; zz <= z2; zz++) {
		for(let yy = y; yy <= y2; yy++) {
			for(let xx = x; xx <= x2; xx++) {
				if(erase == true) {
					array[zz][yy][xx] = 2;
					//console.log("ERASED Z"+zz+"Y"+yy+"X"+xx);
				} else {
					array[zz][yy][xx] = 1;
					//console.log("DRAWN Z"+zz+"Y"+yy+"X"+xx);
				}
			}
		}
	}
}

var maze = 0;
var bc = []; //0 = x, 1 = y, z = 2;
var bc2 = []; //same and this is coordinates used to draw / erase a block defined area
var drawingblock = 0;
var erase = false;
var mstacky = new stack();
var mstackx = new stack();
var mstackz = new stack();
var keys = [];
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';

	if(pause == 0) {
		if(framecheck == 0) {
    if(keys[38]) { //up arrow
	keys[38] = 0;
	mouse.y--;
	if(mouse.y < 0) mouse.y = canvas.height - 1;
	draw();
    }
    if(keys[40]) { //down arrow
	keys[40] = 0;
	mouse.y++;
	if(mouse.y > canvas.height - 1) mouse.y = 0;
	draw();
    }
    if(keys[39]) { //right arrow
	keys[39] = 0;
	mouse.x++;
	if(mouse.x > canvas.width - 1) mouse.x = 0;
	draw();
    }
    if(keys[37]) { //left arrow
	keys[37] = 0;
	mouse.x--;
	if(mouse.x < 0) mouse.x = canvas.width - 1;
	draw();
    }
    if(keys[85]) { //u
		keys[85] = 0;
		if(zlevel < depth - 1) {
			zlevel++
			if(under == 1) {
				document.title = zlevel + 1 + " UNDER";
			} else if(above == 1) {
				document.title = zlevel + 1 + " ABOVE";
			} else {
				document.title = zlevel + 1;
			}
		}
    }
	if(keys[68]) { //d
		keys[68] = 0;
		if(zlevel > 0) {
			zlevel--;
			if(under == 1) {
				document.title = zlevel + 1 + " UNDER";
			} else if(above == 1) {
				document.title = zlevel + 1 + " ABOVE";
			} else {
				document.title = zlevel + 1;
			}
		}
	}
}

	if(keys[79]) { //o
		keys[79] = 0;
		out(map);
	}
	if(keys[83]) { //s
		keys[83] = 0;
		if(under == 0) {
			under = 1;
			above = 0;
			document.title = zlevel + 1 + " UNDER";
		} else if(under == 1) {
			under = 0;
			above = 0;
			document.title = zlevel + 1;
		}
	}
	if(keys[65]) { //a
		if(above == 0) {
			above = 1;
			under = 0;
			document.title = zlevel + 1 + " ABOVE";
		} else if(above == 1) {
			above = 0;
			under = 0;
			document.title = zlevel + 1;
		}
	}
	if(keys[71]) { //g generate
		let choice = 0
		switch(Number(prompt("TYPE 1 TO GENERATE A MAZE ON YOUR CURRENT LEVEL!\n\n TYPE 2 TO COPY THE LAYER UNDER OR ABOVE YOU BUT INVERTED!\n\nTYPE 3 TO COPY THE LAYER THAT IS UNDER OR ABOVE YOU!\n\nTYPE 4 TO ERASE CURRENT LAYER!\n\nTYPE 5 TO DRAW / ERASE A BLOCK DEFINED AREA!\n\nTYPE 6 TO NOT DO ANYTHING"))) {
			case 1: //maze generation
				maze = 1;
				map[zlevel][mouse.y][mouse.x] = 1;
				mstackx.change(mouse.x);
				mstacky.change(mouse.y);
				mstackz.change(zlevel);
				//for(let i = 0; i < depth; i++) {
					for(let j = 0; j < canvas.height; j++) {
						for(let k = 0; k < canvas.width; k++) {
							map[zlevel][j][k] = 1;
						}
					}
				//}
			break;
			case 2: //draw inverted layer above or under you
				if(confirm("CONFIRM TO COPY THE LAYER BUT INVERTED UNDER YOU\n\nDONT CONFIRM TO COPY THE LAYER BUT INVERTED ABOVE YOU!")) choice = 1; //under
				for(let i = 0; i < canvas.height; i++) {
					for(let j = 0; j < canvas.width; j++) {
						if(choice == 0 && map[zlevel + 1]?.[i][j] !== 1 && zlevel < depth - 1) {
							map[zlevel][i][j] = 1;
						} else if(choice == 1 && map[zlevel - 1]?.[i][j] !== 1 && zlevel >= 0) {
							map[zlevel][i][j] = 1;
						}
					}
				}
			break;
			case 3: //copy layer under or above you
				if(confirm("CONFIRM TO COPY THE LAYER UNDER YOU\n\nDONT CONFIRM TO COPY THE LAYER ABOVE YOU!")) choice = 1; //under
				for(let i = 0; i < canvas.height; i++) {
					for(let j = 0; j < canvas.width; j++) {
						if(choice == 0 && zlevel < depth - 1) {
							map[zlevel][i][j] = map[zlevel + 1][i][j];
						} else if(choice == 1 && zlevel >= 0) {
							map[zlevel][i][j] = map[zlevel - 1][i][j];
						}
					}
				}
			break;
			case 4: //erase current layer
				if(confirm("CONFIRM THAT YOU WANT TO ERASE THIS CURRENT LAYER")) {
					for(let i = 0; i < canvas.height; i++) {
						for(let j = 0; j < canvas.width; j++) {
							map[zlevel][i][j] = 2;
						}
					}
				}
			break;
			case 5: //block draw / erase
				if(confirm("CONFIRM IF YOU WANNA DRAW A BLOCK AREA\n\nDONT CONFIRM IF YOU WANNA ERASE A BLOCK AREA")) {
					erase = false;
				} else erase = true;
				drawingblock = 1;
				alert("CLICK WHERE THE BLOCK AREA IS TO START");
			break;
		}
		keys[71] = 0;
	}
	game();
}

}

var drawing = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(let i = 0; i < canvas.height; i++) {
		for(let j = 0; j < canvas.width; j++) {
			if(map[zlevel][i][j] == 1) {
				ctx.fillStyle = "white";
				ctx.fillRect(j,i,1,1);
			} else if(under == 1 && map[zlevel - 1]?.[i][j] === 1) {
				ctx.fillStyle = "rgb(50,0,0)";
				ctx.fillRect(j,i,1,1);
			} else if(above == 1 && map[zlevel + 1]?.[i][j] === 1) {
				ctx.fillStyle = "rgb(0,0,50)";
				ctx.fillRect(j,i,1,1);
			} else {
				map[zlevel][i][j] = 2
			}
		}
	}
	ctx.fillStyle = "grey";
	ctx.fillRect(mouse.x,mouse.y,1,1);
}




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

			// Ensure the data is an array
			if (!Array.isArray(jsonData)) {
				console.error("Invalid JSON data format.");
				return;
			}
			canvas.width = jsonData[0];
			canvas.height = jsonData[1];
			depth = canvas.height;
			map = array3D(canvas.width,canvas.height,depth);
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
	game();
}



var game = () => {
	if(framecheck == 1) return 0;
	if(above == 1 && under == 1) {
		above = 0;
		under = 0;
		document.title = zlevel + 1;
	}

	if(maze == 1) document.title = "GENERATING MAZE PATH!";
	while(maze == 1) { //maze generation (recursive backtracking)
		pause = 1;
		let went = 0;
		let direction = RB(1,4); // 1 = front, 2 = back, 3 = left, 4 = right, 5 = up, 6 = down (not doing 3d mazes yet so im sticking to 2 dimensions rn)
		let direction2 = RB(1,2);
		let count = 0;
		while(went == 0) {
			let y = mstacky.peek();
			let x = mstackx.peek();
			let z = mstackz.peek();
			switch(direction) {
				case 1: //front
					if(map[z][y - 2]?.[x] !== 2 && y - 2 >= 0) {
						mstacky.push(y - 2);
						mstackx.push(x);
						mstackz.push(z);
						map[z][y - 1][x] = 2;
						map[z][y - 2][x] = 2;
						went = 1;
					}
				break;
				case 2: //back
					if(map[z][y + 2]?.[x] !== 2 && y + 2 < canvas.height) {
						mstacky.push(y + 2);
						mstackx.push(x);
						mstackz.push(z);
						map[z][y + 1][x] = 2;
						map[z][y + 2][x] = 2;
						went = 1;
					}
				break;
				case 3: //left
					if(map[z][y][x - 2] !== 2 && x - 2 >= 0) {
						mstacky.push(y);
						mstackx.push(x - 2);
						mstackz.push(z);
						map[z][y][x - 1] = 2;
						map[z][y][x - 2] = 2;
						went = 1;
					}
				break;
				case 4: //right
					if(map[z][y][x + 2] !== 2 && x + 2 < canvas.width) {
						mstacky.push(y);
						mstackx.push(x + 2);
						mstackz.push(z);
						map[z][y][x + 1] = 2;
						map[z][y][x + 2] = 2;
						went = 1;
					}
				break;
				/*
				case 5: //up
				if(map[z + 2]?.[y][x] !== 2 && z + 2 < depth) {
					mstacky.push(y);
					mstackx.push(x);
					mstackz.push(z + 2);
					map[z + 1][y][x] = 2;
					map[z + 2][y][x] = 2;
					went = 1;
				}
				break;
				case 6: //down
				if(map[z - 2]?.[y][x] !== 2 && z - 2 > 0) {
					mstacky.push(y);
					mstackx.push(x);
					mstackz.push(z - 2);
					map[z - 1][y][x] = 2;
					map[z - 2][y][x] = 2;
					went = 1;
				}
				break;
				*/
			}
			if(went == 0) {
				count++;
				if(direction2 == 1) {
					direction--;
					if(direction < 1) direction = 4;
				} else if(direction2 == 2) {
					direction++;
					if(direction > 4) direction = 1;
				}
				if(count >= 3) {
					count = 0;
					direction = RB(1,4);
					direction2 = RB(1,2);
					mstackx.pop();
					mstacky.pop();
					mstackz.pop();
					if(mstackx.isempty() || mstacky.isempty() || mstackz.isempty()) {
						went = 1;
						mstackx.empty();
						mstacky.empty();
						mstackz.empty();
						mstackx.push(0);
						mstacky.push(0);
						mstackz.push(zlevel);
						maze = 0;
						pause = 0;
						above = 0;
						under = 0;
						document.title = zlevel + 1;
					}
				}
			}
		}
	}

	if(pause == 0 || maze == 1) drawing();
	framecheck = 1;

	setTimeout(() => {
		framecheck = 0;
	},1000/30);
}

game();
