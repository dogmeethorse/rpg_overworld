// facing index
// 0, 1 front 2, 3 back 4, 5 left 6, 7 right

var oldManSprites = [
						new Tile(0,2, true),
						new Tile(1,2, true),
						new Tile(2,2, true),
						new Tile(3,2, true),
						new Tile(4,2, true),
						new Tile(5,2, true),
						new Tile(6,2, true),
						new Tile(7,2, true)
					]
var fatLadySprites = [
						new Tile(0,3, true),
						new Tile(1,3, true),
						new Tile(2,3, true),
						new Tile(3,3, true),
						new Tile(4,3, true),
						new Tile(5,3, true),
						new Tile(6,3, true),
						new Tile(7,3, true)
					 ]
var fatLadySprites = [
						new Tile(0,3, true),
						new Tile(1,3, true),
						new Tile(2,3, true),
						new Tile(3,3, true),
						new Tile(4,3, true),
						new Tile(5,3, true),
						new Tile(6,3, true),
						new Tile(7,3, true)
					 ]
var oldJewSprites = [
						new Tile(0,4, true),
						new Tile(1,4, true),
						new Tile(2,4, true),
						new Tile(3,4, true),
						new Tile(4,4, true),
						new Tile(5,4, true),
						new Tile(6,4, true),
						new Tile(7,4, true)
					 ]
var blackGirlSprites = [
						new Tile(0,5, true),
						new Tile(1,5, true),
						new Tile(2,5, true),
						new Tile(3,5, true),
						new Tile(4,5, true),
						new Tile(5,5, true),
						new Tile(6,5, true),
						new Tile(7,5, true)
					 ]
var kidShroomSprites = [
						new Tile(0,6, true),
						new Tile(1,6, true),
						new Tile(2,6, true),
						new Tile(3,6, true),
						new Tile(4,6, true),
						new Tile(5,6, true),
						new Tile(6,6, true),
						new Tile(7,6, true)
					 ]
function randomInt(min,max){
    return Math.floor(Math.random() * (max - (min-1) )) + min;
}
     

function NPC(name, sprites, xTile, yTile){
	this.name = name;
	this.direction = "stop";
	this.sprites = sprites;
	this.tilePos = [];
	this.tilePos[0] = xTile;
	this.tilePos[1] = yTile;
	this.x = xTile * DEST_WIDTH;; //for pixel positions
	this.y = yTile * DEST_HEIGHT;;
	this.onScreen = false;
	this.currentFrame = 0;
}

NPC.prototype.talk = function(){
	console.log("talking");
	var dialogBox = document.getElementById('dialogBox');
	dialogBox.innerHTML = "<p> Thou hast triggered the sample dialog</p>";
}

NPC.prototype.draw = function(){
	this.sprites[this.currentFrame].draw(this.x,this.y, true);
	this.currentFrame++;
	if(this.currentFrame> 1){
	 this.currentFrame = 0;
	}
}

function MovingNPC(name, sprites, xTile, yTile){
	this.name = name;
	this.direction = "stop";
	this.sprites = sprites;
	this.tilePos = [];
	this.tilePos[0] = xTile;
	this.tilePos[1] = yTile;
	this.x = xTile * DEST_WIDTH; //for pixel positions
	this.y = yTile * DEST_HEIGHT;
	this.onScreen = false;
	this.currentFrame = 0;
	this.speed = 8;
	this.distanceTravelled = 0;
}
MovingNPC.prototype = new NPC();
MovingNPC.constructor = NPC.constructor;

MovingNPC.prototype.getDirection = function(){
	var randomDirection = randomInt(0,6);
	if(randomDirection < 3){
		this.direction = "stop";
	}
	else if(randomDirection == 3){
		this.direction = "up";
	}
	else if(randomDirection == 4){
		this.direction = "down";
	}
	else if(randomDirection == 5){
		this.direction = "left";
	}
	else if(randomDirection == 6){
		this.direction = "right";
	}
}
MovingNPC.prototype.checkTargetTile = function(){
		if(!map.tileList[this.targetTileValue].passable){
			this.direction = 'stop';
			this.targetTile = this.tilePos;
			return;
		}
		if( (this.targetTile[0] == hero.tilePos[0] &&
			this.targetTile[1] == hero.tilePos[1]) ||
			(this.targetTile[0] == hero.targetTile[0] &&
			this.targetTile[1] == hero.targetTile[1])
			){
			this.direction = 'stop';
			this.targetTile = this.tilePos;
			return;
		}
			
		for(var npc = 0; npc < map.NpcList.length; npc++){
			if( this.targetTile[0] == map.NpcList[npc].tilePos[0] &&
				this.targetTile[1] == map.NpcList[npc].tilePos[1]){
				this.direction = "stop";
				this.targetTile = this.tilePos;
				return;
			}
		}
}

MovingNPC.prototype.getTargetTile = function(){
	if(this.direction == "down"){
		this.targetTile =[this.tilePos[0],this.tilePos[1]+1];
	}
	else if(this.direction == "up"){
		this.targetTile =[this.tilePos[0],this.tilePos[1]-1];
	}
	else if(this.direction == "right"){
		this.targetTile =[this.tilePos[0] + 1,this.tilePos[1]];
		}
	else if(this.direction == "left"){
		this.targetTile =[this.tilePos[0] -1 ,this.tilePos[1]];
	}
	else if(this.direction == "stop"){
		this.targetTile =[this.tilePos[0], this.tilePos[1]]; 
	}
	this.targetTileValue = map.layout[this.targetTile[1]][this.targetTile[0]];	//reversed because row comes first
}

MovingNPC.prototype.destinationReached = function(){
	if(this.distanceTravelled >= DEST_WIDTH ||
		this.distanceTravelled == 0){
		this.distanceTravelled = 0;
		return true;
	}
	else{
		return false;
	}
}

MovingNPC.prototype.updatePos = function(){
	console.log(this.distanceTravelled + " " + this.x + " " + this.y + " " + this.currentFrame);
	if(this.direction != "stop"){
		this.distanceTravelled += this.speed;
	}
	if(this.direction == "down"){
		this.y += this.speed;
	}
	else if(this.direction == "up"){
		this.y -= this.speed;
	}
	else if(this.direction == "right"){
		this.x += this.speed;
	}
	else if(this.direction == "left"){
		this.x -= this.speed;
	}		
}
NPC.prototype.draw = function(){
	this.sprites[this.currentFrame].draw(this.x, this.y, true);
}
MovingNPC.prototype.selectFrame = function(){
			if(this.direction == "down"){
				if(this.currentFrame != 0){
					this.currentFrame = 0;
				}
				else{
					this.currentFrame ++;
				}		
			} 
			
			if(this.direction == "up"){
				if(this.currentFrame != 2){
					this.currentFrame = 2;
				}
				else{
					this.currentFrame ++;
				}		
			} 
			if(this.direction == "left"){
				if(this.currentFrame != 4){
					this.currentFrame = 4;
				}
				else{
					this.currentFrame ++;
				}		
			} 
			if(this.direction == "right"){
				if(this.currentFrame != 6){
					this.currentFrame = 6;
				}
				else{
					this.currentFrame ++;
				}
			}
}

MovingNPC.prototype.move = function(){
	//console.log("npc moving");
	if(this.destinationReached()){
		this.getDirection();
		this.getTargetTile();
		this.checkTargetTile();
		this.tilePos = [this.targetTile[0], this.targetTile[1]];
		//console.log(this.distanceTravelled);
	}
	this.updatePos();
	this.selectFrame();
}

