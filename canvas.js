const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 10
canvas.width = canvas.height * 2;
depth = 10;
zlevel = 0;
document.title = zlevel + 1;
pause = 0;
timer = 0;
under = 0;
above = 0;

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
    for (let i = 0; i < z + 5; i++) {
        array[i] = [];
        for (let j = 0; j < y + 5; j++) {
            array[i][j] = [];
            for (let k = 0; k < x + 5; k++) {
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
	ctx.clearRect(0,0,canvas.width,canvas.height);
	let array = farray;

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
		map = array3D(canvas.height,canvas.width,depth);
		pause = 0;
	},5000)
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
})
addEventListener("click", (e) => {
	if(pause == 0) draw();
})
var keys = [];
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';
	if(pause == 0) {
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
	if(keys[79]) { //o
		keys[79] = 0;
		let smap = map;
		out(map);
		map = smap;
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
}




var game = () => {
	if(above == 1 && under == 1) {
		above = 0;
		under = 0;
		document.title = zlevel + 1;
	}
	setTimeout(() => {
		if(pause == 0) drawing();
		game();
	},1000/30);
}
game();