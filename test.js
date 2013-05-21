function test(input, output){
	var result = "";
	robot.init(input);
	result = robot.state.x+' '+robot.state.y+' '+robot.state.direction;
	if (result == output){
		console.log('success: '+output);
	} else {
		console.log('fail: expected '+output+', received '+result);
	}
}
var robot = {
	'state': { // this object holds our robot's current data - we write to here from all functions below
		'grid' : {}
	},
	'init' : function(data){
		var robot = this, // we set up this variable at the start of all functions so we can easily refer to other objects in the class.
			lines = data.split(/\r\n|\r|\n/g), //this regex accounts for different browsers handling new lines in different ways
			grid = lines[0].split(" "),
			position = lines[1].split(" "),
			instructions = lines[2];
		
		//assign our new array values to their respective 'state' values
		//we also need to make sure these are treated as numbers, not strings (with parseInt)
		robot.state.x = parseInt(position[0]);
		robot.state.y = parseInt(position[1]);
		robot.state.direction = position[2];
		robot.state.grid.x = parseInt(grid[0]);
		robot.state.grid.y = parseInt(grid[1]);
		
		// just a bit of a sense-check before we start - is the robot even on the plateau? if so, put him back on at the nearest edge.
		if (robot.state.x > robot.state.grid.x){
			robot.state.x = robot.state.grid.x;
		}
		if (robot.state.y > robot.state.grid.y){
			robot.state.y = robot.state.grid.y;
		}
		if (robot.state.x < 0){
			robot.state.x = 0;
		}
		if (robot.state.y < 0){
			robot.state.y = 0;
		}
		
		//send our string of instructions to be processed
		robot.process(instructions);
	},
	'process' : function(instructions){
		var robot = this,
			instructions = instructions.split(""),
			thisCommand; //initialising throwaway variables outside of for loops is more memory-efficient
		for (var i = 0; i < instructions.length; i++){
			thisCommand = instructions[i];
			
			if (thisCommand == "M"){ //if we are moving
				robot.move();
				//console.log('move '+robot.state.direction);
			} else { // the command must be L or R - but we'll double-check later.
				robot.rotate(thisCommand);
				//console.log('rotate '+robot.state.direction);
			}
		}
	},
	'move' : function(){
		var robot = this
			dir = robot.state.direction;
		if (dir == "N"){
			// the next line just stops our robot falling off the edge (same for all directional cases) - we only make smart robots here.
			if (robot.state.y < robot.state.grid.y){ 
				robot.state.y++;
			}
		} else if (dir == "S"){
			if (robot.state.y > 0){
				robot.state.y--;
			}
		} else if (dir == "E"){
			if (robot.state.x < robot.state.grid.x){
				robot.state.x++;
			}
		} else if (dir == "W"){
			if (robot.state.x > 0){
				robot.state.x--;
			}
		}
		return;
	},
	'rotate' : function(dir){
		var robot = this,
			dirOrder = new Array("N","E","S","W");
			currentIndex = dirOrder.indexOf(robot.state.direction);
		if (currentIndex != -1){
			if (dir == "L"){
				currentIndex--;
			} else if (dir == "R"){
				currentIndex++;
			} else {
				// if command isn't L or R then something is wrong.
				console.log('Error: invalid command '+dir)
			}
			
			//make sure we stay within the array.
			if (currentIndex > dirOrder.length){ 
				currentIndex = 0;
			} else if (currentIndex < 0){
				currentIndex = dirOrder.length-1;
			}
			//update direction state
			robot.state.direction = dirOrder[currentIndex];
		} else {
			//just in case the robot is somehow facing in an invalid direction
			console.log('Error: currentIndex invalid');
		}
		return;
	}
}
window.onload = function(){
	test("5 5\n1 2 N\nLMLMLMLMM", "1 3 N"); //example test case
	test("2 2\n0 0 N\nMMRMRM", "1 1 S"); // another normal test case
	test("10 5\n2 2 N\nMMMMMMMM", "2 5 N"); // make sure we can't run off of the North edge
	test("10 5\n2 2 N\nRRMMMMMMMM", "2 0 S"); // make sure we can't run off of the South edge
	test("10 2\n3 2 N\nRMMMMMMMMMMMMMMM", "10 2 E"); // make sure we can't run off of the East edge
	test("10 5\n2 2 N\nRRRMMMMMMMMMMMMMMM", "0 2 W"); // make sure we can't run off of the West edge
	test("3 3\n0 0 N\nMRMLMRMLMRMLMRML", "3 3 N"); // make sure we can't run off of the NE
	test("3 3\n3 1 S\nMMMMMRMMMMMM", "0 0 W"); // make sure we can't run off of the SW
	test("5 2\n5 3 E\nMRMRMM", "3 1 W"); // If the robot is positioned off the grid, he's put back on at the nearest edge...
}