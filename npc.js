var oldManRest1 = new Tile(0,2, true);
var oldManRest2 = new Tile(1,2, true);

function randomInt(min,max){
    return Math.floor(Math.random() * (max - (min-1) )) + min;
}
     

function NPC(name, sprites, xTile, yTile){
	this.name = name;
	this.sprites = sprites;
	this.tilePos = [];
	this.tilePos[0] = xTile;
	this.tilePos[1] = yTile;
	this.x = null; //for pixel positions
	this.x = null;
	this.onScreen = false;
	this.counter = 0;
}

NPC.prototype.talk = function(){
	console.log("talking");
	var dialogBox = document.getElementById('dialogBox');
	dialogBox.innerHTML = "<p> Thou hast triggered the sample dialog</p>";
}

NPC.prototype.draw = function(){
	this.sprites[this.counter].draw(this.tilePos[0],this.tilePos[1]);
	this.counter++;
	if(this.counter > 1){
	 this.counter = 0;
	}
}

function movingNPC(){
	this.direction = "stop";
}

movingNPC.prototype = new NPC();

movingNPC.prototype.getDirection = function(){
	var direction = randomInt(0,6);
	if(direction > 3){
		this.direction = "stop";
	}
	else if(direction == 3){
		this.direction = "up";
	}
	else if(direction == 4){
		this.direction = "down";
	}
	else if(direction == 5){
		this.direction = "left";
	}
	else if(direction == 6){
		this.direction = "right";
	}
}

movingNPC.prototype.getTargetTile = function(){
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

movingNPC.prototype.destinationReached = function(){

}

movingNPC.prototype.updatePos = function(){

}

movingNPC.prototype.move = function(){
	if(this.destinationReached()){
		this.getDirection();
		this.getTargetTile();
	}
	else{
		this.updatePos();
	}
}

