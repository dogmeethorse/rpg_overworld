/*
 * List of Enemies
 * Order of stats:
 * name,hp,dmg,aggro,atk,esc
 */

var enemy_pics = [];

function Enemy(index, name,hp,dmg,aggro,atk,esc){
	this.index = index;
	this.name = name;
	this.xp = hp;
	this.hp = hp;
	this.maxDmg = dmg;
	this.minDmg = 0;
	this.atkChance = atk;
	this.escChance = esc;
	this.aggro = aggro;  //chance on whether monster will attack of flee from 0-1
	this.maxHp = this.hp;
	
	Enemy.prototype.draw = function(){
		if(combat.oldState === DUNGEON){
			hCtx.fillStyle = "#140C1C";
			hCtx.fillRect(100, 20, 500, 500);
			//hCtx.fillStyle = "#4E4A4E";
			//hCtx.fillRect(150, 300, 400, 150);
		}
		else{
			hCtx.drawImage(fightBackground, 150, 50, 400, 400);
		}
		console.log("drawing enemy?");	
		hCtx.drawImage(enemies.pics[this.index], 150, 25, 400,400);
	}
	
	Enemy.prototype.isAlive = function(){
		if(this.hp> 0){
			return true;
		}
		else{ 
			return false;
		}
	}
	Enemy.prototype.die = function(){
		this.hp = this.maxHp;
	}
	Enemy.prototype.hit = function(){
		var attackRoll = Math.random();
		if(attackRoll > this.atkChance){
			return false;
		}
		else{
			return true;
		}
	}
	Enemy.prototype.dealDamage = function(){
		return randomInt(this.minDmg, this.maxDmg);
	}
	
	Enemy.prototype.takeTurn = function(){
		sendMessage("The " + this.name + " is attacking!", false);
		var damage = null;
		if(this.hit()){
			damage = this.dealDamage();
			var feedback = "The " + this.name + " hit you for " + damage + " damage!";
			combatHero.hp -= damage;
			sendMessage(feedback, false);
		}
		else{
			var feedback = "The " + this.name + " missed you!";
			sendMessage(feedback, false);
		}
		return damage;
	}
	
	Enemy.prototype.greeting = function(){
		sendMessage("A " + this.name + " approaches. The " + this.name + " leers at you.", true);
	}
}

function loadImage(imName){
	//imName must end in .png
	var im = new Image;
	im.src="dusk_enemies/"+ imName;
	return im;
}

//
//
//
var enemies = {
	pics : [],
	list : [	//index, name,	hp,dmg,aggro,atk,esc
		new Enemy(0, 'These are Supposed to be Bones', 11, 2, 0, 0.2, 0),//0
		new Enemy(1, 'Mean Lady',  25, 10, 0, 0.35, 0),					//1
		new Enemy(2, 'Robed Jerk', 10,  3, 0, 0.65, .25),				//2
		new Enemy(3, 'Imp',         4,  1, 0, 0.4, .65), 				//3
		new Enemy(4, 'Angry Chest', 22,  12, 0, 0.6, .2),				//4
		new Enemy(5, 'Scary Shadow',7,  4, 0, 0.6, .3),					//5
		new Enemy(6, 'Gross Thing', 6,  4, 0, 0.3, .4),					//6
		new Enemy(7, 'Skeleton',    3,  2, 0, 0.3, .6),					//7
		new Enemy(8, 'Zombie',      5,  3, 0, 0.4, .8),					//8
		new Enemy(10, 'Poorly Drawn Bat', 30, 10, 0, 0.6, 0),			//9
		new Enemy(11, 'Salty Slime', 20, 8, 0, 0.7, 0),					//10
		new Enemy(12, 'Different Colored Imp', 16, 13, 0, 0.5, 0)],		//11
	zone : 0,
	zones :[[8, 7, 3], [0, 3, 5, 6], [2, 5, 6], [2, 5, 6],[4, 9, 10, 11]],
	loadPics: function(){
		//loads into img array
		console.log('loading images');
		this.pics[0] = loadImage('bone_shield.png');
		this.pics[1] = loadImage('death_speaker.png');
		this.pics[2] = loadImage('druid.png');
		this.pics[3] = loadImage('imp.png');
		this.pics[4] = loadImage('mimic.png');
		this.pics[5] = loadImage('shadow_soul.png');
		this.pics[6] = loadImage('shadow_tendrils.png');
		this.pics[7] = loadImage('skeleton.png');
		this.pics[8] = loadImage('zombie.png');
		this.pics[9] = loadImage('Dragon3.png');
		this.pics[10] =loadImage('bat.png');
		this.pics[11] =loadImage('slime.png');
		this.pics[12] =loadImage('darkImp.png');
	},
	getZone : function(){
		if(state === DUNGEON){
			this.zone = 4;
		}
		else if(hero.tilePos[0] < 13){
			if(hero.tilePos[1] < 8){
				this.zone = 0;	
			}
			else{
				this.zone = 2;
			}
		}
		else if(hero.tilePos[0] >=13){
			if(hero.tilePos[1] < 12){
				this.zone = 1;
			}
			else{
				this.zone = 3;
			}
		}
	},
	selectBaddy : function(){
		var baddy = randomInt(0, this.zones[this.zone].length -1);
		return enemies.list[this.zones[this.zone][baddy]];
	},
	handleAppearance : function(){
		this.getZone();
		combat.init();
	},
	areThere : function(){
		var encounterRoll = Math.random();
		if(encounterRoll < 0.2){
			return true;
		}
		else{
			return false;
		}
	}
}
var dragon = new Enemy(9, "Dragon", 60, 10, 0, 0.3, 0);

dragon.drawOnMap = function(x, y){
	dragonLeftHead.draw(x, y);
	dragonRightHead.draw(x+1, y);
	dragonLeftBody.draw(x, y+1);
	dragonRightBody.draw(x+1, y+1);
}
dragon.collision = function(dragonx, dragony){
	if(dragonx != hero.targetTile[0] && dragonx + 1 != hero.targetTile[0]){
		return false;
	}
	else if(dragony != hero.targetTile[1] && dragony + 1 != hero.targetTile[1]){
		return false;
	}
	else if((dragonx == hero.tilePos[0] && dragony == hero.tilePos[1]) ||// no longer understand this
	(dragonx + 1 == hero.tilePos[0] && dragony + 1 == hero.tilePos[1])){
		return false;
	}
	else{
		return true;
	}
}

dragon.loadScript = function(){
	dialogBox.loadBuffer(script.dragon1,
	 					script.dragon2, 
	 					script.dragon3, 
					 	script.dragon4,
					 	script.dragon5,
					 	script.dragon6, 
	 					script.dragonquestion);
}

dragon.introduction = function(){
	this.loadScript();
	dialogBox.clear();
	dialogBox.open();
	dialogBox.sayNextInBuffer();
}
dragon.battle = function(){
	dialogBox.leaveQuestionMode();
	//alert('fighting');
	fightButton.style.display  = "inline";
	runButton.style.display    = "inline";
	fightButton.disabled = false;
	runButton.disabled   = false;
	combat.currentEnemy = this;
	combat.attachEvents();
	state = BATTLE;
}

dragon.yes = function(){
	dragon.removelisteners();
	dialogBox.leaveQuestionMode();
	yesToDragon.start();
}
dragon.no = function(){
	dragon.removelisteners();
	//alert('clicked no');
	dragon.battle();
	
}

dragon.addListeners = function(){
	yesButton.addEventListener('click', dragon.yes);
	noButton.addEventListener('click', dragon.no);
}

dragon.removelisteners = function(){
	yesButton.removeEventListener('click', dragon.yes);
	noButton.removeEventListener('click', dragon.no);
}

dragon.propose = function(){
	dialogBox.sayNextInBuffer();
	this.addListeners();
	dialogBox.enterQuestionMode();
}

dragon.encounter = function(){
	combat.oldState = DUNGEON;
	this.draw();
	this.introduction();
}
dragon.die = function(){
	if(dragon.isAlive()){
		combatHero.die();
	}
	else{
		delete dungeon.specialLocations.boss;
		state = dungeon;
		dragonDead.start();
	}
}

var evilMayor = Object.create(dragon);
	evilMayor.index = 1;
	evilMayor.name = "Very angry mayor";
	evilMayor.xp = 25;
	evilMayor.hp = 25;
	evilMayor.maxDmg = 14;
	evilMayor.minDmg = 2;
	evilMayor.atkChance = 0.4;
	evilMayor.escChance = 0;
	evilMayor.aggro = 1;  
	evilMayor.maxHp = this.hp;

evilMayor.collision = function(){
	var mayorTiles = [
		[7,13],
		[8,13],
		[9,13],
		[7,14],
		[9,14],
		[7,15],
		[8,15],
		[9,15]
	];
	for( var tile = 0; tile < mayorTiles.length; tile++){
		if(hero.targetTile[0] === mayorTiles[tile][0] &&
		hero.targetTile[1] === mayorTiles[tile][1]){
			return true;	
		}
	}
	return false;
}
evilMayor.loadScript = function(){
	dialogBox.loadBuffer(script.mayor1, script.mayor2, script.mayor3);
}
evilMayor.die = function(){
	console.log("die function");
	if(evilMayor.hp <= 0){
		overworld.mayor = false;
		state = OVERWORLD;
		//change scripts so people react to mayor's death
		fingerhut.NpcList[1].changeMessage(script.mayorFingerhutPostMayor);
		fingerhut.NpcList[8].changeMessage(script.oldJewPostMayor);
		fingerhut.NpcList[10].changeMessage(script.kidShroom1PostMayor);
	}
	else {
		console.log('passed out');
		state = PASSEDOUT;
	}
}
enemies.loadPics();