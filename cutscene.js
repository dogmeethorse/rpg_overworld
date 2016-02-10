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
var wakeUp = Object.create(cutScene)

wakeUp.start = function(){
	wakeUp.init();
	map = fingerhut;
	state = TALK;
	combatHero.gold = 0;
	combatHero.hp = combatHero.maxHp; 
	combatHero.setStats();
	dialogBox.revertState = TOWN;
	dialogBox.loadBuffer(script.mayorWakeUp1,
		script.mayorWakeUp2,
		script.mayorWakeUp3,
		script.mayorWakeUp4);
	context.translate(-64, -576);
	dialogBox.sayNextInBuffer();
	hero.currentFrame = 0;
	hero.x = 320;
	hero.y = 320;
	hero.tilePos	= [6, 14];
	hero.targetTile	= [6, 14];
	map.x = -64;
	map.y = -576;
	drawScreen();
	dialogBox.sayNextInBuffer()
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

