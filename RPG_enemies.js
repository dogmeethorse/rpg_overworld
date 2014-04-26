/*
 * List of Enemies
 * Order of stats:
 * name,hp,dmg,aggro,atk,esc
 */

const NUM_ENEMIES = 9;

var enemy_pics = [];

function Enemy(index, name,hp,dmg,aggro,atk,esc){
	this.index = index;
	this.name = name;
	this.hp = hp;
	this.maxDmg = dmg;
	this.minDmg = 0;
	this.atkChance = atk;
	this.escChance = esc;
	this.aggro = aggro;  //chance on whether monster will attack of flee from 0-1
	this.maxHp = this.hp;
	
	Enemy.prototype.draw = function(){		
		 hCtx.drawImage(enemies.pics[this.index], 150, 0, 400,400);
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

var enemies = {
	pics : [],
	list : [	
		new Enemy(0,'These are Supposed to be Bones', 11, 2, 0, 0.2, 0),//0
		new Enemy(1,'Mean Lady', 25, 10, 0, 0.3, 0),					//1
		new Enemy(2,'Robed Jerk', 10, 3, 0, 0.2, 0),					//2
		new Enemy(3,'Imp', 4, 1, 0, 0.2, 0), 							//3
		new Enemy(4,'Angry Chest', 8, 5, 0, 0.2, 0),					//4
		new Enemy(5,'Scary Shadow', 7, 4,0, 0.2, 0),					//5
		new Enemy(6,'Gross Thing', 6, 4, 0, 0.2, 0),					//6
		new Enemy(7,'Skeleton', 3, 2, 0, 50, 0.2, 0),					//7
		new Enemy(8,'Zombie', 5, 3, 0, 20, 0)],							//8
	zone : 0,
	zones :[[8,7,3], [0,3,5,6], [2,5,6], [2,5,6]],
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
	},
	getZone : function(){
		if(hero.tilePos[0] < 13){
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
		var baddy = randomInt(0, this.zones.length -1);
		return this.list[this.zones[this.zone][baddy]];
	},
	handleAppearance : function(){
		console.log('enemy found');
		state = BATTLE;
		this.getZone();
		//this.selectBaddy();
		combat.init();
	},
	areThere : function(){
		var encounterRoll = Math.random();
		if(encounterRoll < 0.5){
			return true;
		}
		else{
			return false;
		}
	}
}
enemies.loadPics();