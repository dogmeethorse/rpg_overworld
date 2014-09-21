// facing index
// 0, 1 front 2, 3 back 4, 5 left 6, 7 right

var script= {
	placeholder : "Hey buddy",
	fingerhutShop : "Buy Something Will ya!",
	blackGirl : "Let me see you dance!"	,
	dogBoy : "The dragon made fun of my dog!",
	fatLady1 : "The dragon judged me!",
	kidShroom1 : "The mayor of Pallas is attacking anyone who tries to enter the town.",
	oldJew : "Can't go to Pallas anymore since the mayor flipped out!",
	mayorFingerhut : "The other mayor is mean!",
	bathGuy : "Are you too shy to take your clothes off at the public bath too? How will we ever get clean?",
	bathGuy2 : "The Dragon flew by. It made me feel small and insecure.",
	antisocial: "No, you can't come in my house. Don't even talk to me.",
	squatter : "Thanks for killing the mayor! Now I can live in her house!",
	poorLady : "Can I have the dead mayor's cloak?",
	poorLady2 : "Tell my husband to bite me!",
	questionableLady : "Are you just gonna look all day?",
	mayorLookAlike : "I heard I look just like the mayor of Fingerhut. He must get all the ladies!",
	poorJew : "Whaddya want an award? for killing the mayor!? The game is called Dragonsmasher, not mayor smasher!",
	wanderingJew : "This little town of Pallas is a lot quieter now that the mayor is gone.",
	blonde : "I could give you a great big kiss for murdering that woman! SMOOCH!",
	civic : "We really need to invest in infrastructure! This place is falling apart!",
	warner : "If you travel past the mountains the monsters get tougher.",
	dragon1 : "Hey Guy, What are you doing in my house?",
	dragon2 : "Wait, You want to kill me, why? I am just hanging out in a cave.",
	dragon3 : function(){dialogBox.clear()},
	dragon4 : "Don't be like this. Join me. Fly around and laugh at the people of this island with me!",
	dragon5 : function(){dialogBox.clear()},
	dragon6 : function(){dragon.propose()},
	dragonquestion : "What do you say?",
	intro1 : "You wake up...",
	intro2 : " with a desire...",
	intro3 : "   to kill monsters and get xp!",
	mayor1 : "How Dare You try to enter my town!",
	mayor2 : "I will smash you!",
	mayor3 : function(){evilMayor.battle()}
}

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
var blondeSprites = [
						new Tile(0,7, true),
						new Tile(1,7, true),
						new Tile(2,7, true),
						new Tile(3,7, true),
						new Tile(4,7, true),
						new Tile(5,7, true),
						new Tile(6,7, true),
						new Tile(7,7, true)
]
var afroGuySprites = [
						new Tile(0,8, true),
						new Tile(1,8, true),
						new Tile(2,8, true),
						new Tile(3,8, true),
						new Tile(4,8, true),
						new Tile(5,8, true),
						new Tile(6,8, true),
						new Tile(7,8, true)
]
var alienSprites = [
						new Tile(0,9, true),
						new Tile(1,9, true),
						new Tile(2,9, true),
						new Tile(3,9, true),
						new Tile(4,9, true),
						new Tile(5,9, true),
						new Tile(6,9, true),
						new Tile(7,9, true)
]
var ninjaZorroSprites = [
						new Tile(0,10, true),
						new Tile(1,10, true),
						new Tile(2,10, true),
						new Tile(3,10, true),
						new Tile(4,10, true),
						new Tile(5,10, true),
						new Tile(6,10, true),
						new Tile(7,10, true)
]
var technicianSprites = [
						new Tile(0,11, true),
						new Tile(1,11, true),
						new Tile(2,11, true),
						new Tile(3,11, true),
						new Tile(4,11, true),
						new Tile(5,11, true),
						new Tile(6,11, true),
						new Tile(7,11, true)
]
var moustacheSprites = [
						new Tile(0,12, true),
						new Tile(1,12, true),
						new Tile(2,12, true),
						new Tile(3,12, true),
						new Tile(4,12, true),
						new Tile(5,12, true),
						new Tile(6,12, true),
						new Tile(7,12, true)
]

var dogBoySprites = [
						new Tile(0,13, true),
						new Tile(1,13, true),
						new Tile(2,13, true),
						new Tile(3,13, true),
						new Tile(4,13, true),
						new Tile(5,13, true),
						new Tile(6,13, true),
						new Tile(7,13, true)
]

function NPC(name, sprites, xTile, yTile, message){
	this.name = name;
	this.direction = "stop";
	this.sprites = sprites;
	this.tilePos = [];
	this.tilePos[0] = xTile;
	this.tilePos[1] = yTile;
	this.x = xTile * DEST_WIDTH;; //for pixel positions
	this.y = yTile * DEST_HEIGHT;;
	this.onScreen = false; //not using this yet.
	this.currentFrame = 0;
	this.talking = false;
	this.message = message || script.placeholder;
}

NPC.prototype.talk = function(){
	//state = TALK;
	console.log("talking");
	this.talking = true;
	//physically moving the divs around
	dialogBox.open();
	sendMessage(this.message, true);
}

NPC.prototype.draw = function(){
	this.sprites[this.currentFrame].draw(this.x,this.y, true);
	this.currentFrame++;
	if(this.currentFrame> 1){
	 this.currentFrame = 0;
	}
}

function MovingNPC(name, sprites, xTile, yTile, message){
	NPC.apply(this, [name, sprites, xTile, yTile, message]);
	this.speed = 8;
	this.distanceTravelled = 0;
}
MovingNPC.prototype = new NPC();

MovingNPC.prototype.getDirection = function(){
	var randomDirection = randomInt(0,30);
	if(randomDirection < 27){
		this.direction = "stop";
	}
	else if(randomDirection == 27){
		this.direction = "up";
	}
	else if(randomDirection == 28){
		this.direction = "down";
	}
	else if(randomDirection == 29){
		this.direction = "left";
	}
	else if(randomDirection == 30){
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

function Shopkeeper(name, sprites, xTile, yTile, message){
	NPC.apply(this, [name, sprites, xTile, yTile, message]);
}
Shopkeeper.prototype = new NPC();

Shopkeeper.prototype.talk = function(){
	NPC.prototype.talk.call(this);
	shopPallas.open();
}