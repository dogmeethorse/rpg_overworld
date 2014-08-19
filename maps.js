/* next add npc object
	have merchant or shopkeeper inherit
	look up more on inheritance
	eventPicLoaded is going to be a huge pain in the future. all asset loading will need 
	to be completely redone.
	*/

	tileSheet.addEventListener('load', eventPicLoaded, false);
	tileSheet.src = "tiles_16.png";
	fightBackground.src = "fightBackground.png";
	
	var forest      = new Tile(0,  0, true);
	var sand        = new Tile(2,  0, true);
	var nightForest = new Tile(6,  0, true);
	var water       = new Tile(8,  0, false);
	var swamp       = new Tile(4,  0, true);
	var mountain    = new Tile(3,  0, false);
	var nightSand   = new Tile(9,  0, true);
	var city        = new Tile(10, 0, true);
	var dungeon     = new Tile(11, 0, true);
	var tileFloor   = new Tile(1,  0, true);
	var woodBlock   = new Tile(12, 0, false);
	var stones      = new Tile(13, 0, true);
	var darkStone   = new Tile(14, 0, false);
	var redFloor    = new Tile(15, 0, true);
	var orStone     = new Tile(16, 0, false);
	
	function eventPicLoaded() {
		startUp();
	}
	
	var overworld = {
		layout : [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,3,3,0,0,0,0,0,0,0],
			[0,1,1,1,0,0,2,1,2,1,1,0,0,0,0,0,0,0,0,2,1,0,0,0],
			[0,1,1,2,2,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0,1,1,0,0],
			[0,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,0,0,1,1,0,0],
			[0,4,2,2,2,7,2,1,2,2,1,1,1,1,2,2,2,1,1,2,2,3,0,0],
			[0,4,4,2,2,2,2,1,1,0,0,0,0,1,2,2,2,1,2,1,2,3,0,0],
			[0,4,4,2,2,1,3,3,1,0,0,0,0,2,2,2,2,1,0,1,2,3,3,0],
			[0,4,1,2,2,2,1,1,2,2,2,2,2,2,2,1,1,0,0,0,2,2,0,0],
			[0,1,1,2,2,2,2,2,2,2,4,4,4,4,1,3,1,0,0,0,2,2,0,0],
			[0,0,1,2,2,1,1,2,2,4,0,0,0,4,3,3,1,0,0,0,2,1,0,0],
			[0,0,0,1,2,2,2,2,3,3,3,3,3,3,2,2,1,0,0,4,2,1,0,0],
			[0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,2,4,4,0,0,0],
			[0,0,0,0,1,1,1,2,2,1,1,1,1,1,1,1,0,4,2,4,2,2,0,0],
			[0,0,0,0,1,2,2,2,7,2,2,1,2,1,1,2,0,4,2,2,2,3,3,0],
			[0,0,0,0,2,2,2,2,2,2,3,3,3,1,3,2,4,2,4,4,3,8,4,0],
			[0,0,0,0,2,2,2,3,3,1,1,2,3,2,4,4,4,4,4,4,3,4,4,0],
			[0,3,3,0,0,2,3,3,3,3,3,1,1,1,4,4,0,0,0,3,4,4,0,0],
			[0,3,3,0,0,2,2,2,2,2,2,1,1,1,4,4,0,0,0,4,4,4,0,0],
			[0,3,0,0,0,2,2,1,1,1,2,2,2,1,4,4,0,0,0,4,4,4,0,0],
			[0,0,0,0,1,1,0,0,1,1,1,2,1,1,4,4,4,2,2,2,4,4,4,0],
			[0,0,0,2,2,2,2,0,1,2,2,1,1,2,2,4,4,4,4,2,2,2,0,0],
			[0,0,0,0,1,1,2,0,2,2,2,0,0,2,2,4,4,4,2,2,2,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],
		tileList : [water, sand, forest, mountain, swamp, nightSand, nightForest, city, dungeon],
		x:0,
		y:0,
		draw : function(){
			for( var row = 0; row < NUM_ROWS; row++){
				for(var col = 0; col < NUM_COLS; col++){
					this.tileList[this.layout[row][col]].draw(col,row, false);
				}
			}
		}
	}
	overworld.checkSpecialTiles = function(){	
		//check if on fingerhut location
		//console.log('checking tiles');
		if((hero.targetTile[0] == 5 && hero.targetTile[1] == 5) &&
			(hero.tilePos[0] != 5 || hero.tilePos[1] != 5)
		){
			fingerhut.enterTown();
			hero.direction = "stop";
			hero.getTargetTile();
		}
		//check if on Pallas location
		else if((hero.targetTile[0] == 8 && hero.targetTile[1] == 14) &&
			(hero.tilePos[0] != 8 || hero.tilePos[1] != 14)
		){
			pallas.enterTown();
			hero.direction = "stop";
			hero.getTargetTile();
		}
		else if((hero.targetTile[0] == 21 && hero.targetTile[1] == 15) &&
				(hero.tilePos[0] != 21 || hero.tilePos[1] != 15)
		){
			dungeon.enterTown();
			hero.direction= "stop";
			hero.getTargetTile();		
		}	
		else if(hero.distanceTravelled > 0){
			if(enemies.areThere()){
				enemies.handleAppearance();
			}
		}	
	}	
	
	var fingerhut = Object.create(overworld);
	fingerhut.layout = [
			[2,2,2,2,2,2,2,2,2,2,0,6,6,0,2,2,2,2,2,2,2,2,2,2],
			[2,2,3,3,3,3,3,3,3,2,0,6,6,0,0,3,3,0,0,0,0,0,0,2],
			[2,2,3,5,5,5,5,5,3,2,0,6,6,0,0,0,0,3,3,3,3,3,0,2],
			[2,2,3,5,2,5,2,5,3,2,0,6,6,0,0,0,0,3,5,5,5,3,0,2],
			[2,1,3,5,2,5,2,5,3,2,0,6,6,0,3,3,3,3,5,5,5,3,0,2],
			[2,2,3,5,5,5,5,5,3,2,0,6,6,0,3,5,5,3,5,5,5,3,0,2],
			[2,2,3,3,3,5,3,3,3,2,0,6,6,0,3,5,5,3,5,5,5,3,0,2],
			[2,2,2,2,2,5,2,2,2,2,0,6,6,0,3,5,3,3,3,3,5,3,0,2],
			[2,1,1,1,1,5,1,1,1,1,2,6,6,2,1,5,1,1,1,1,5,1,1,2],
			[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
			[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
			[2,0,0,6,2,2,2,6,2,2,2,6,6,2,2,5,0,0,0,0,5,1,0,2],
			[2,0,0,6,3,3,3,5,3,3,3,6,6,2,2,5,5,5,5,5,5,2,0,2],
			[2,0,0,6,3,5,5,5,5,5,3,6,6,6,1,1,1,1,1,1,1,1,0,2],
			[2,0,0,6,3,5,5,5,5,5,3,6,6,3,3,3,3,6,3,3,3,6,3,2],
			[2,0,0,6,3,5,5,5,5,5,3,6,6,6,6,3,6,6,6,3,6,6,3,2],
			[2,0,0,6,3,3,3,3,3,3,3,6,6,3,6,3,6,6,6,3,6,6,3,2],
			[2,0,0,6,6,6,6,6,6,6,6,6,6,3,3,3,3,3,3,3,3,3,3,2],
			[2,0,0,0,0,2,2,2,2,2,2,6,6,3,5,5,0,0,0,5,5,5,3,2],
			[2,0,0,0,0,2,2,1,1,1,2,6,6,3,5,5,0,0,0,5,5,5,3,2],
			[2,0,0,0,1,1,0,0,1,1,1,6,6,5,5,5,2,5,2,5,5,5,3,2],
			[2,0,0,0,2,2,2,2,2,2,2,6,6,3,5,5,5,5,5,5,5,5,3,2],
			[2,0,0,0,1,1,2,2,2,2,2,6,6,3,5,5,2,5,2,5,5,5,3,1],
			[2,2,2,2,2,2,2,2,2,2,2,6,6,3,3,3,3,3,3,3,3,3,3,1]
		];
	fingerhut.tileList = [water, sand, forest, woodBlock, swamp, tileFloor, stones];
	fingerhut.NpcList = [
		new Shopkeeper("Old Man",   oldManSprites, 15, 6, script.fingerhutShop),
		new MovingNPC("Old Clone", oldManSprites,  3, 14),
		new MovingNPC("Black Girl", blackGirlSprites, 22, 10, script.blackGirl),
		new MovingNPC("Old Jew", oldJewSprites, 12, 5),
		new MovingNPC("fat lady", fatLadySprites, 21, 16),
		new MovingNPC("kid shroom", kidShroomSprites, 8, 20)
	];
	
	fingerhut.enterTown = function(){
		state = TOWN;	
		hero.tilePos = [11,1];
		hero.targetTile = [11,1];
		hero.x = 320;
		hero.y = 64;
		context.setTransform(1,0,0,1,0,0);
		context.translate(-384, 0);
		map = this;
	}
	
	fingerhut.leaveTown = function(){
		state = OVERWORLD;
		context.setTransform(1,0,0,1,0,0);
		map = overworld;
		hero.tilePos[0] = 5;
		hero.tilePos[1] = 5;
		hero.targetTile[0] = 5;
		hero.targetTile[1] = 5; 
		hero.x = 320;
		hero.y = 320;	
	}

	fingerhut.checkSpecialTiles = function(){
		if( hero.targetTile[0] <  1 ||
			hero.targetTile[0] > 22 ||
			hero.targetTile[1] <  1 ||
			hero.targetTile[1] > 22){
			//console.log("leaving town?");
			this.leaveTown();
		}
	}
	fingerhut.drawNPCs = function(){
		for( var npc = 0; npc < this.NpcList.length; npc++){
			this.NpcList[npc].draw();
		}
	}
	
	var pallas = Object.create(fingerhut);
	pallas.layout = [
			[3,3,3,3,3,3,3,3,3,3,3,6,6,3,3,3,3,3,3,3,3,3,3,3],
			[3,2,2,2,2,2,2,2,2,2,2,6,1,2,2,2,2,2,2,2,2,2,2,3],
			[3,2,3,5,1,5,1,5,3,2,2,1,1,4,1,1,1,3,3,3,3,3,1,3],
			[3,2,1,5,2,5,2,5,1,2,2,1,1,2,4,4,1,3,5,5,5,3,1,3],
			[3,1,3,5,1,3,1,5,3,2,2,1,1,2,4,4,1,1,5,5,5,3,1,3],
			[3,2,1,5,1,5,1,5,1,1,1,1,1,2,1,1,2,3,5,5,5,3,1,3],
			[3,2,3,1,3,5,3,1,3,5,5,5,5,5,5,5,1,3,5,5,5,3,1,3],
			[3,2,2,2,2,5,2,2,2,5,0,0,0,0,0,5,2,3,3,3,5,3,1,3],
			[3,1,1,1,1,5,1,1,1,5,0,0,0,0,0,5,1,1,1,1,5,1,1,3],
			[1,6,6,6,6,6,2,6,6,5,0,0,5,0,0,5,6,6,6,6,1,1,2,6],
			[6,6,1,1,6,6,6,6,1,5,0,0,0,0,0,5,1,1,2,6,6,6,6,6],
			[3,3,3,3,6,2,2,2,2,5,0,0,0,0,0,5,2,2,2,2,2,2,2,3],
			[3,5,5,3,1,2,2,2,2,5,5,5,5,5,5,5,1,1,1,2,1,2,3,3],
			[3,5,5,1,6,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,3,3],
			[3,5,5,3,6,3,3,3,3,1,1,2,6,2,2,2,2,6,2,2,2,6,2,3],
			[3,3,3,3,1,3,5,5,3,1,1,6,6,6,6,2,6,6,6,2,2,2,2,3],
			[3,5,5,3,6,1,5,5,3,2,1,6,2,2,6,2,2,2,2,2,2,2,2,3],
			[3,5,5,1,1,3,3,3,3,6,6,6,2,3,3,3,3,3,3,3,3,3,5,3],
			[3,5,5,3,6,3,5,5,3,2,2,6,6,3,5,5,3,5,5,3,5,5,5,3],
			[3,3,3,3,6,1,5,5,3,1,2,2,6,3,5,5,3,5,5,3,5,5,5,3],
			[3,5,5,3,6,3,5,5,3,1,1,6,6,5,5,5,3,3,5,3,5,5,5,3],
			[3,5,5,1,6,3,3,3,3,2,2,6,1,3,5,5,5,5,5,5,5,5,5,3],
			[3,5,5,3,6,1,2,2,2,2,2,6,6,3,5,5,5,5,5,3,5,5,5,3],
			[3,3,3,3,3,3,3,3,3,3,3,1,6,3,3,3,3,3,3,3,3,3,3,3]
		];
	
	pallas.leaveTown = function(){
		state= OVERWORLD;
		context.setTransform(1,0,0,1,0,0);
		context.translate(-192, -576);
		map = overworld;
		hero.tilePos[0] = 8;
		hero.tilePos[1] = 14;
		hero.targetTile[0] = 8;
		hero.targetTile[1] = 14; 
		hero.x = 320;
		hero.y = 320;	
	}
	var map = fingerhut;
	
	var dungeon = Object.create(fingerhut);
	//                   0         1             2         3          4         5        6
	dungeon.tileList = [stones, nightForest, nightSand, darkStone, redFloor, orStone, water];
	dungeon.layout= [
			[3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,3,3,3,3,3,3,3],
			[3,2,2,2,2,2,2,2,2,2,2,0,0,2,2,0,2,3,2,2,2,2,2,3],
			[3,2,3,5,1,5,1,5,3,2,2,0,1,4,2,2,1,3,3,3,3,3,1,3],
			[3,2,1,5,2,0,2,5,1,2,2,0,1,2,4,5,1,3,0,0,0,3,1,3],
			[3,1,3,0,1,0,1,5,3,2,2,1,1,2,4,5,2,2,0,0,0,3,1,3],
			[3,2,1,5,1,3,1,0,0,0,0,0,0,2,1,5,2,3,0,0,0,3,1,3],
			[3,2,3,1,3,0,3,1,3,5,0,1,5,0,0,5,1,3,0,0,0,3,1,3],
			[3,2,2,2,2,0,2,2,2,5,0,0,0,0,0,5,2,3,3,3,0,3,1,3],
			[3,1,1,1,1,0,4,1,1,5,0,0,0,0,0,5,1,1,1,1,0,1,1,3],
			[1,6,6,6,6,6,4,6,6,5,0,3,5,3,3,5,6,6,6,6,4,1,2,6],
			[6,6,1,1,6,6,4,6,1,5,0,3,0,0,0,5,1,1,2,6,4,6,6,6],
			[3,3,3,3,6,2,4,2,2,5,0,3,0,0,0,5,2,2,2,2,4,2,2,3],
			[3,0,0,3,1,2,4,2,2,5,5,5,0,5,5,5,6,6,1,2,4,2,3,3],
			[3,0,5,1,0,1,4,0,0,0,0,0,0,0,0,0,6,6,3,2,4,3,3,3],
			[3,0,0,3,0,3,4,3,3,1,1,2,6,2,2,6,6,6,2,2,2,6,2,3],
			[3,3,3,3,2,3,0,0,0,1,1,6,6,6,6,6,6,6,6,2,2,2,2,3],
			[3,0,0,3,0,1,0,5,0,2,1,6,2,2,6,2,2,2,0,2,2,2,2,3],
			[3,0,0,1,2,3,3,3,3,0,0,6,2,3,3,3,3,3,0,3,3,3,5,3],
			[3,0,0,3,0,3,0,0,3,2,2,6,6,3,0,0,3,5,4,3,5,5,5,3],
			[3,0,0,0,0,1,0,0,3,1,2,2,6,3,0,0,3,3,4,3,3,3,5,3],
			[3,0,0,0,0,0,0,0,3,1,1,6,6,0,0,0,3,4,4,4,4,3,0,3],
			[3,0,0,1,0,3,3,3,3,2,2,6,1,3,0,0,3,4,4,4,4,3,0,3],
			[3,0,0,3,0,1,2,2,2,2,2,6,6,3,0,0,3,4,4,4,4,3,0,3],
			[3,3,3,3,3,3,3,3,3,3,3,1,6,3,3,3,3,3,3,3,3,3,3,3]
		];
	dungeon.NpcList = [];
	dungeon.enterTown = function(){
		state = TOWN;	
		hero.tilePos = [11,1];
		hero.targetTile = [11,1];
		hero.x = 320;
		hero.y = 64;
		context.setTransform(1,0,0,1,0,0);
		context.translate(-384, 0);
		map = this;
	}
	dungeon.leaveTown = function(){
		state = OVERWORLD;
		context.setTransform(1,0,0,1,0,0);
		context.translate(-64 * 13, -64 * 10);
		map = overworld;
		hero.tilePos[0] = 21;
		hero.tilePos[1] = 15;
		hero.targetTile[0] = 21;
		hero.targetTile[1] = 15; 
		hero.x = 512;
		hero.y = 320;	
	}
	
	function showDebugInfo(){
		keyOutput.innerHTML = "Keys up: <br> up = " + keys.upUp+ " <br>left = " + keys.leftUp + " <br> right = " + keys.rightUp + " <br> down = " + keys.downUp; 
		keyOutput.innerHTML += "<br> direction = " + hero.direction;
		keyOutput.innerHTML += "<br> target Tile = " + hero.targetTile[0] + " " + hero.targetTile[1];
		keyOutput.innerHTML += "<br> hero.tilePos = " + hero.tilePos[0] + " " + hero.tilePos[1];
		keyOutput.innerHTML += "<br> hero.distanceTravelled = " + hero.distanceTravelled;
		keyOutput.innerHTML += "<br> target Tile value = " + hero.targetTileValue;
		keyOutput.innerHTML += "<br> target Tile passable = " + map.tileList[hero.targetTileValue].passable || "undefined";
		keyOutput.innerHTML += "<br> map.x = " + map.x;
		keyOutput.innerHTML += "<br> map.y = " + map.y;
		keyOutput.innerHTML += "<br> hero.x = " + hero.x;
		keyOutput.innerHTML += "<br> hero.y = " + hero.y;
		keyOutput.innerHTML += "<br> hero.moveStyle = " + hero.moveStyle;		
	}

	var keys = {
		downUp : true,
		upUp : true,
		leftUp : true,
		rightUp : true,	
		handleDown : function(e){
			/* 37 = left, 38 = up, 39 = right, 40 = down
			 * 87 = w, 65 = a, 84 = s, 68 =d
			 * 32 = spacebar
			 */
			var key = e.keyCode;
			
			if(key == 37 || key == 65){
				hero.nextDirection = 'left';
				keys.leftUp = false;
			}
			if(key == 38 || key == 87){Tile
				hero.nextDirection = 'up';
				keys.upUp  = false;
			}
			if(key == 39 || key == 68){
				hero.nextDirection = 'right';
				keys.rightUp = false;
			}
			if(key == 40 || key == 83){
				hero.nextDirection = 'down';
				keys.downUp = false;
			}
			if(key == 32){ //this is talking not quite sure how to add it in.
				hero.nextDirection = 'stop';
				hero.action = true;
				console.log("trying action " + hero.action);
			}
		},
		handleUp : function(e){
			var key = e.keyCode;
			
			if(key == 37 || key == 65){
				keys.leftUp = true;
			}
			if(key == 38 || key == 87){
				keys.upUp = true;
			}
			if(key == 39 || key == 68){
				keys.rightUp = true;
				
			}
			if(key == 40 || key == 83){
				keys.downUp= true;
			}	
		}
	}	
	
	function drawScreen() {		 
		map.draw();
		hero.draw();
		if(map.drawNPCs){
			map.drawNPCs();
		}
	}
	
	function startUp() {				
		window.addEventListener('keydown', keys.handleDown, false);
		window.addEventListener('keyup', keys.handleUp, false);
		
		drawScreen();

		setInterval(function(){
			hero.move();
			if(state == TOWN){
				if(map.NpcList){
					for(var npc = 0; npc < map.NpcList.length; npc++){
						if(map.NpcList[npc] instanceof MovingNPC){
							//console.log("attempt to move");
							map.NpcList[npc].move();
						}
					}
				}
			}
			if(state != BATTLE){
				drawScreen();
			}
			showDebugInfo();
		}, 1000/8)
	}