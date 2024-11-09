const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = Number(prompt("BUILD SIZE!\n\nIT IS BEST TO START OUT WITH 5 OR 10 IF IT IS YOUR FIRST TIME!\n\n(TYPE IN A NUMBER)"));
canvas.width = canvas.height * 2;
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

function allNeighborsAreOne(array, z, y, x) {
	for (let dz = -1; dz <= 1; dz++) {
	  for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
		  // Skip the center cell itself
		  if (dz === 0 && dy === 0 && dx === 0) continue;
  
		  // Check if the neighbor exists and has a value of 1
		  if (array[z + dz]?.[y + dy]?.[x + dx] !== 1) {
			return false; // Return false if any neighbor is undefined or not equal to 1
		  }
		}
	  }
	}
	return true; // All neighbors are defined and equal to 1
  }


function allNeighborsAreOne2d(array,z,y,x,c) {
	if(c == 0) { //1x3x3
		for(let dy = -1; dy <= 1; dy++) {
			for(let dx = -1; dx <= 1; dx++) {
				if(dx === 0 && dy === 0) continue;

				if(array[z][y + dy]?.[x + dx] !== 1) {
					return false;
				}
			}
		}
		return true;
	} else if(c == 1) { //3x1x3
		for(let dz = -1; dz <= 1; dz++) {
			for(let dx = -1; dx <= 1; dx++) {
				if(dz === 0 && dx === 0) continue;

				if(array[z + dz]?.[y][x + dx] !== 1) {
					return false;
				}
			}
		}
		return true;
	} else if(c == 2) { //3x3x1
		for(let dz = -1; dz <= 1; dz++) {
			for(let dy = -1; dy <= 1; dy++) {
				if(dz === 0 && dy === 0) continue;

				if(array[z + dz]?.[y + dy]?.[x] !== 1) {
					return false;
				}
			}
		}
		return true;
	}
}

function out(farray) {
	pause = 1;
	let array = JSON.parse(JSON.stringify(farray)); //yeah I had to copy the fucking array because javascript likes to change original array otherwise. fuck you javascript

	// cellular automata written by me
	for(let i = 0; i < 3; i++) {

	for(let z = 0; z < depth; z++) {
		for(let y = 0; y < canvas.height; y++) {
			for(let x = 0; x < canvas.width; x++) {

				if(i == 2) { // last stage

				if(array[z][y][x] == 1) {
				if(!(typeof array[z]?.[y]?.[x - 1] === "undefined" || typeof array[z]?.[y]?.[x + 1] === "undefined") && (array[z][y][x - 1] == 1 && array[z][y][x + 1] == 1)) { //1x1x3
					array[z][y][x + 1] = 2;
					array[z][y][x - 1] = 2;
					array[z][y][x] = 3;
				} else if(!(typeof array[z]?.[y - 1]?.[x] === "undefined" || typeof array[z]?.[y + 1]?.[x] === "undefined") && (array[z][y - 1][x] == 1 && array[z][y + 1][x] == 1)) { //1x3x1
					array[z][y - 1][x] = 2;
					array[z][y + 1][x] = 2;
					array[z][y][x] = 4;
				} else if(!(typeof array[z - 1]?.[y]?.[x] === "undefined" || typeof array[z + 1]?.[y]?.[x] === "undefined") && (array[z - 1][y][x] == 1 && array[z + 1][y][x] == 1)) { //3x1x1
					array[z - 1][y][x] = 2;
					array[z + 1][y][x] = 2;
					array[z][y][x] = 5;
				}
			}

				} else if(i == 1) { // second stage

					if(array[z][y][x] == 1) {
					if(allNeighborsAreOne2d(array,z,y,x,0)) { //1x3x3
						for(let dy = -1; dy <= 1; dy++) {
							for(let dx = -1; dx <= 1; dx++) {
								if(dx === 0 && dy === 0) continue;

								array[z][y + dy][x + dx] = 2;
								}
							}

						array[z][y][x] = 6;
					} else if(allNeighborsAreOne2d(array,z,y,x,1)) { //3x1x3
						for(let dz = -1; dz <= 1; dz++) {
							for(let dx = -1; dx <= 1; dx++) {
								if(dz === 0 && dx === 0) continue;
				
								array[z + dz][y][x + dx] = 2;
							}
						}
						array[z][y][x] = 7;
					} else if(allNeighborsAreOne2d(array,z,y,x,2)) { //3x3x1
						for(let dz = -1; dz <= 1; dz++) {
							for(let dy = -1; dy <= 1; dy++) {
								if(dz === 0 && dy === 0) continue;
				
								array[z + dz][y + dy][x] = 2;
							}
						}
						array[z][y][x] = 8;
					}
				}

				} else if(i == 0) { // first stage

					if(array[z][y][x] == 1) {
						if(allNeighborsAreOne(array,z,y,x)) { //3x3x3
							for(let dz = -1; dz <= 1; dz++) {
								for(let dy = -1; dy <= 1; dy++) {
									for(let dx = -1; dx <= 1; dx++) {
										if (dz === 0 && dy === 0 && dx === 0) continue;
										array[z + dz][y + dy][x + dx] = 2
									}
								}
							}
							array[z][y][x] = 9;
						}
					}
				}

			}
		}
	}
	}

	//json
	filename = prompt("WHAT NAME WILL THE FILE BE") + ".json";
    // Convert the 3D array to JSON format
    const json = JSON.stringify(array);

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
	setTimeout(() => {
		pause = 0;
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
					console.log("ERASED Z"+zz+"Y"+yy+"X"+xx);
				} else {
					array[zz][yy][xx] = 1;
					console.log("DRAWN Z"+zz+"Y"+yy+"X"+xx);
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
		switch(Number(prompt("TYPE 1 TO GENERATE A MAZE PATH ON YOUR CURRENT LEVEL!\n\n TYPE 2 TO COPY THE LAYER UNDER OR ABOVE YOU BUT INVERTED!\n\nTYPE 3 TO COPY THE LAYER THAT IS UNDER OR ABOVE YOU!\n\nTYPE 4 TO ERASE CURRENT LAYER!\n\nTYPE 5 TO DRAW / ERASE A BLOCK DEFINED AREA!\n\nTYPE 6 TO NOT DO ANYTHING"))) {
			case 1: //maze generation
				maze = 1;
				map[zlevel][mouse.y][mouse.x] = 1;
				mstackx.change(mouse.x);
				mstacky.change(mouse.y);
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

			// Ensure the data is a 3D array
			if (!Array.isArray(jsonData)) {
				console.error("Invalid JSON data format.");
				return;
			}

			//I added so that the build size changes with build file imported
			canvas.width = 0;
			for(let i = 0; i < jsonData[0][0].length; i++) {
				if(jsonData[0][0][i] > 0) canvas.width++;
			}
			canvas.height = canvas.width / 2;
			depth = canvas.height;
			zlevel = 0;
			document.title = zlevel + 1;
			above = 0;
			under = 0;

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
		let direction = RB(1,4); // 1 = up, 2 = down, 3 = left, 4 = right
		let direction2 = RB(1,2);
		let count = 0;
		while(went == 0) {
			let y = mstacky.peek();
			let x = mstackx.peek();
			switch(direction) {
				case 1: //up
					if(map[zlevel][y - 2]?.[x] !== 1 && y - 2 >= 0) {
						mstacky.push(y - 2);
						mstackx.push(x);
						map[zlevel][y - 1][x] = 1;
						map[zlevel][y - 2][x] = 1;
						went = 1;
					}
				break;
				case 2: //down
					if(map[zlevel][y + 2]?.[x] !== 1 && y + 2 < canvas.height) {
						mstacky.push(y + 2);
						mstackx.push(x);
						map[zlevel][y + 1][x] = 1;
						map[zlevel][y + 2][x] = 1;
						went = 1;
					}
				break;
				case 3: //left
					if(map[zlevel][y][x - 2] !== 1 && x - 2 >= 0) {
						mstacky.push(y);
						mstackx.push(x - 2);
						map[zlevel][y][x - 1] = 1;
						map[zlevel][y][x - 2] = 1;
						went = 1;
					}
				break;
				case 4: //right
					if(map[zlevel][y][x + 2] !== 1 && x + 2 < canvas.width) {
						mstacky.push(y);
						mstackx.push(x + 2);
						map[zlevel][y][x + 1] = 1;
						map[zlevel][y][x + 2] = 1;
						went = 1;
					}
				break;
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
					if(mstackx.isempty() || mstacky.isempty()) {
						went = 1;
						mstackx.empty();
						mstacky.empty();
						mstackx.push(0);
						mstacky.push(0);
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
