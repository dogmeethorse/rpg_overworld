	const TILE_WIDTH  = 16;
	const TILE_HEIGHT = 16;
	const DEST_WIDTH = 64;
	const DEST_HEIGHT = 64;
	const NUM_COLS = 24;
	const NUM_ROWS = 24;
	const SCREEN_BORDER = 5;
	
	const START = 1;
	const ENDGAME = 0;
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
	var yesButton = document.getElementById('yes');
	var noButton = document.getElementById('no');
	
	context.imageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    hCtx.imageSmoothingEnabled = false;
    hCtx.webkitImageSmoothingEnabled = false;
    hCtx.mozImageSmoothingEnabled = false;
	
	var tileSheet = new Image();
	var fightBackground = new Image();
	var gameLoop;
	var state = TOWN;

	var counter= 0;
	
	function randomInt(min, max){
   		return Math.floor(Math.random() * (max - (min-1) )) + min;
	} 
	
	function sendMessage(output,addOrReplace){
		dialogBox.style.zIndex = 4;
   		if(addOrReplace == true){ 		
    	   	dialogBox.innerHTML = '<span class="game">' + output + '</span>';
    	}
   		else{
    	    dialogBox.innerHTML += '<span class="game">' + output + '</span>';
    	}
    	dialogBox.scrollTop = dialogBox.scrollHeight;
	}	
	dialogBox.buffer = [];
	dialogBox.revertState = state;
	dialogBox.loadBuffer = function(){
		for(var i = 0; i < arguments.length; i ++){
			dialogBox.buffer.push(arguments[i]);
		}
	}
	
	dialogBox.clear = function(){
		dialogBox.innerHTML = "";
	}
	dialogBox.clearBuffer = function(){
		dialogBox.buffer = [];
	}
	
	dialogBox.bufferIsEmpty = function(){
		return ((dialogBox.buffer.length < 1)|| dialogBox.question);
	}
	
	dialogBox.sayNextInBuffer = function(){
		var message = dialogBox.buffer.shift()
		if(typeof message !=="string"){
			message();
		}
		else{
			sendMessage(message, false);
		}
	}
	dialogBox.enterQuestionMode = function(){
		dialogBox.question = true;
		yesButton.style.display  = "inline";
		noButton.style.display   = "inline";
	}
	
	dialogBox.leaveQuestionMode = function(){
		dialogBox.question = false;
		yesButton.style.display  = "none";
		noButton.style.display   = "none";		
	}
	
	dialogBox.close = function(){
		dialogBox.style.zIndex = -1;
		state = dialogBox.revertState;
	}
	
	dialogBox.open = function(){
		dialogBox.revertState = state;
		state = TALK;
		dialogBox.style.zIndex = 4;
	}
	
	dialogBox.isOpen = function(){
		if(dialogBox.syle.zIndex === 4){
			return true;
		}
		else{
			return false;
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
	
var cutScene = {}
	cutScene.backCanvas = document.createElement('canvas');
	cutScene.backContext = cutScene.backCanvas.getContext('2d');
	cutScene.backCanvas.height = 192;

cutScene.clear = function(){
	context.setTransform(1,0,0,1,0,0);
	hCtx.setTransform(1,0,0,1,0,0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	hCtx.clearRect(0, 0, canvas.width, canvas.height);
}

cutScene.init = function(){
	clearInterval(gameLoop);
	cutScene.clear();
	dialogBox.clear();
}

cutScene.drawCharacter = function(character, x, y){
	context.drawImage(character, x, y);
}

var yesToDragon = Object.create(cutScene);

yesToDragon.start = function(){
	yesToDragon.init();
	context.drawImage(tileSheet, TILE_WIDTH * hero.frames[0].x, TILE_HEIGHT * hero.frames[0].y,TILE_WIDTH, TILE_HEIGHT, 32, 32, DEST_WIDTH, DEST_HEIGHT);
	dragon.drawOnMap(0, 1);
	var fullD = context.getImageData(0, 32, 128, 192);
	this.backContext.putImageData(fullD, 0, 0);
	cutScene.clear();
	context.drawImage(this.backCanvas, 150, 150);	
	map = fingerhut;
	dialogBox.loadBuffer(script.dragonYes1, script.dragonYes2, script.dragonYes3, script.dragonYes4, script.dragonYes5, script.dragonYes6);
	dialogBox.sayNextInBuffer();
	window.addEventListener('keydown', dialogBox.sayNextInBuffer, false);
	yesToDragon.update();
}
yesToDragon.x = 30;
yesToDragon.y = -30;
yesToDragon.siner = 0.1;
yesToDragon.update = function(){
	context.scale(0.5, 0.5);
	map.draw();
	map.drawNPCs();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.drawImage(yesToDragon.backCanvas, Math.sin(yesToDragon.siner) * yesToDragon.x + 275, Math.cos(yesToDragon.siner) * yesToDragon.y + 200);
	yesToDragon.siner += 0.07;
	requestAnimationFrame(yesToDragon.update);	
}

dragonDead = Object.create(cutScene);
dragonDead.time = new Date().getTime();
dragonDead.newTime = new Date().getTime();
dragonDead.deltaTime = 0;
dragonDead.ladyMoving = false;
dragonDead.start = function(){
	dragonDead.init();
	dialogBox.loadBuffer(script.dragonDead1,
		script.dragonDead2,
		script.dragonDead3,
		script.dragonDead4,
		script.dragonDead5,
		script.dragonDead6);
	window.addEventListener('keydown', dialogBox.sayNextInBuffer, false);
	map = fingerhut;
	context.translate(-64, -576);
	dialogBox.sayNextInBuffer();
	hero.currentFrame = 0;
	hero.x = 320;
	hero.y = 320;
	dragonDead.moveNpcs();
	dragonDead.update();
}
dragonDead.moveNpcs = function(){
	fingerhut.NpcList[6].tilePos[0] = 3; 
	fingerhut.NpcList[6].tilePos[1] = 14;	
	fingerhut.NpcList[9].tilePos[0] = 13;
	fingerhut.NpcList[9].tilePos[1] = 10;
	fingerhut.NpcList[6].setCoordinates();
	fingerhut.NpcList[9].setCoordinates();	
	fingerhut.NpcList[9].direction = 'left';
}
dragonDead.peopleDance = function(){
	dragonDead.newTime = new Date().getTime();
	dragonDead.deltaTime = dragonDead.newTime - dragonDead.time;
	if(dragonDead.deltaTime > 120){
		dragonDead.time = dragonDead.newTime;
		if(fingerhut.NpcList[1].currentFrame === 0){
			fingerhut.NpcList[1].currentFrame = 1;
			fingerhut.NpcList[6].currentFrame = 1;
		}
		else{
			fingerhut.NpcList[1].currentFrame = 0;
			fingerhut.NpcList[6].currentFrame = 0;
		}
	}
	//fingerhut.NpcList[1].draw();
}
dragonDead.ladyMove = function(){
	if(fingerhut.NpcList[9].x > 448){
		fingerhut.NpcList[9].cutsceneMove();
		console.log
	}
	else if(fingerhut.NpcList[9].y < 13 * 64){
		fingerhut.NpcList[9].direction = 'down';
		fingerhut.NpcList[9].cutsceneMove();
	}
	else if(fingerhut.NpcList[9].x > 448 -64){
		fingerhut.NpcList[9].direction = 'left';
		fingerhut.NpcList[9].cutsceneMove();
	}
	else{
		fingerhut.NpcList[9].direction = 'down';
		fingerhut.NpcList[9].selectFrame();
	}
}
dragonDead.update = function(){
	hero.draw();
	dragonDead.peopleDance();
	if(dragonDead.ladyMoving){
		dragonDead.ladyMove();
	}
	map.draw();
	map.drawNPCs();
	requestAnimationFrame(dragonDead.update);	
}

