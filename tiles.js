	const TILE_WIDTH  = 16;
	const TILE_HEIGHT = 16;
	const DEST_WIDTH = 64;
	const DEST_HEIGHT = 64;
	const NUM_COLS = 24;
	const NUM_ROWS = 24;
	const SCREEN_BORDER = 5;
	
	const START = 1;
	const TOWN	= 10;
	const TALK	= 15;
	const OVERWORLD = 20;
	const DUNGEON = 30;
	const SHOP = 16;
	const BATTLE = 25;
	
	var keyOutput = document.getElementById('keysdown');
	var theCanvas = document.getElementById('canvas');
	var context = theCanvas.getContext('2d');

	var heroCanvas = document.getElementById('hCanvas');
	var hCtx = heroCanvas.getContext('2d');
	var dialogBox = document.getElementById('dialogBox');
	var statsBox = document.getElementById('stats');
	var dragonSmasher = document.getElementById('dragonSmasher');
	var fightButton = document.getElementById('fight');
	var runButton = document.getElementById('run');
	
	context.imageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    hCtx.imageSmoothingEnabled = false;
    hCtx.webkitImageSmoothingEnabled = false;
    hCtx.mozImageSmoothingEnabled = false;
	
	var tileSheet = new Image();
	var state = TOWN;

	var counter= 0;
	
	function randomInt(min, max){
   		return Math.floor(Math.random() * (max - (min-1) )) + min;
	} 
	
	function sendMessage(output,addOrReplace){
		dialogBox.style.zIndex = 4;
   		if(addOrReplace == true){ 		
    	   	dialogBox.innerHTML = '<span>' + output + '</span>';
    	}
   		else{
    	    dialogBox.innerHTML += '<span>' + output + '</span>';
    	}
	}	
	
	function Tile(x, y, passable){
		//passable take a bool true if player can walk on tile, false if not
		this.x = x;
		this.y = y;
		this.passable = passable;
		Tile.prototype.draw = function(drawX, drawY, isNpc){
			if(isNpc){
				context.drawImage(tileSheet,
					TILE_WIDTH * this.x, TILE_HEIGHT * this.y,
					TILE_WIDTH, TILE_HEIGHT,
					drawX, drawY, 
					DEST_WIDTH, DEST_HEIGHT);
			}
			else{
				context.drawImage(tileSheet,
					TILE_WIDTH * this.x, TILE_HEIGHT * this.y,
					TILE_WIDTH, TILE_HEIGHT,
					drawX * DEST_WIDTH, drawY * DEST_HEIGHT,
					DEST_WIDTH, DEST_HEIGHT);
			}	
		}
	}
	
	function Frame(x,y){
		this.x = x;
		this.y = y;
	
		Frame.prototype.draw = function(hx, hy){
			hCtx.clearRect(0,0,6400,6400);
			hCtx.drawImage(tileSheet, TILE_WIDTH * this.x, TILE_HEIGHT * this.y, TILE_WIDTH, TILE_HEIGHT, hx , hy, DEST_WIDTH, DEST_HEIGHT);
		}
	}
	
