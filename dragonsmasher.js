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
	

function Weapon(name, dmgBonus, attackChanceBonus, cost){
	this.name = name;
	this.dmgBonus = dmgBonus;
	this.attackChanceBonus = attackChanceBonus;
	this.cost = cost;
}	

	Weapon.prototype.equip = function(){
		combatHero.weapon.unequip();
		
		combatHero.weapon = this;
		combatHero.maxDmg += this.dmgBonus;
		combatHero.atk += this.attackChanceBonus;
		console.log("wielding :"+ combatHero.weapon.name);
		inventoryMenu.currentWeapon.innerHTML = "<span> Wielding: " +combatHero.weapon.name + "</span>";
	}
	
	Weapon.prototype.unequip = function(){
		combatHero.maxDmg -= this.dmgBonus;
		combatHero.atk -= this.attackChanceBonus;
	}
	Weapon.prototype.buy = function(){
		console.log(this);
		console.log(" buying = "+ this.name + " cost = " + this.cost);
		if(combatHero.gold >= this.cost){
			combatHero.weapons.push(new Weapon(this.name , this.dmgBonus, this.cost));
			combatHero.gold -= this.cost;		
			sendMessage("You bought a " + this.name,true);
			inventoryMenu.updateWeapons();
		}
		else{
			sendMessage("You cannot afford "+ this.name, true);
		}
		combatHero.setStats();
	}

var noWeapon = new Weapon("Bare Hands", 0, 0, 0);
var stick = new Weapon('Wooden Stick', 2, 4, 5);
var dagger = new Weapon('Dagger', 4, 5, 20);
var shortSword = new Weapon('Short Sword', 6, 8, 50);
var flail = new Weapon('Flail', 8, 8, 100);
var longSword = new Weapon('Long Sword', 10, 10, 170);

//Other Inventory

function healingPotion(name,strength, cost){
	this.name = name;
	this.strength = strength;
	this.cost = cost;
	
	healingPotion.prototype.quaff = function(){
		combatHero.hp += this.strength;
		if(combatHero.hp > combatHero.maxHp){
			combatHero.hp = combatHero.maxHp;
		}
		
		combatHero.inventory.splice(combatHero.inventory.indexOf(this), 1);
		combatHero.setStats();
		inventoryMenu.updateItems();
		sendMessage("You quaff the "+ this.name + " and gain " + this.strength + "hp", false);
	}
	
	healingPotion.prototype.buy = function(){
		console.log(this);
		console.log('trying to buy potion');
		console.log("name ="+ this.name + "cost = " + this.cost);
		if(combatHero.gold >= this.cost){
			console.log("buying Potion");
			
			combatHero.inventory.push(new healingPotion(this.name , this.strength, this.cost));
			combatHero.gold -= this.cost;
			
			sendMessage("You bought a "+ this.name,true);			
			console.log("combatHero inventory length =" + combatHero.inventory.length);
			console.log(combatHero.inventory);
			inventoryMenu.updateItems();
			combatHero.setStats();
		}
		else{
			sendMessage("You cannot afford "+ this.name, true);
		}
		
	}
}

var smallPotion = new healingPotion('Small Potion', 5, 5);
var largePotion = new healingPotion('Large Potion', 20, 15);

combatHero = {
	weapon : noWeapon,
	maxHp : 10,
	hp : 10,
	xp : 0,
	nextLvlXp : 100,
	lvl : 1,
	gold : 100,
	attack : 0.5,
	maxDmg : 1 + this.lvl, // + this.weapon.dmgBonus, 
	minDmg :1, // this.lvl,
	weapons : [noWeapon],
	inventory : [],
	fleeChance : 1,
	setStats : function(){
		statsBox.innerHTML  = "<span>Level: " + combatHero.lvl + "</span><br>";
		statsBox.innerHTML += "<span>XP: " + combatHero.xp + "</span><br>";
		statsBox.innerHTML += "<span>HP: " + combatHero.hp + "</span><br>";
		statsBox.innerHTML += "<span>Gold : " + combatHero.gold + "</span><br>";
	}
}

combatHero.dealDamage = function(){
	return randomInt(combatHero.minDmg, combatHero.maxDmg);
}

combatHero.attack = function(){
	//state = OVERWORLD; 
	var attackRoll = Math.random();
	if(attackRoll < 1){
		var damage =  combatHero.dealDamage.apply(combatHero);
		combat.currentEnemy.hp -= damage;
		var feedback = "You hit the " + combat.currentEnemy.name + " for " + damage + " damage!";
		sendMessage( feedback, true);
	}
	dragonSmasher.dispatchEvent(combat.hdone);
}

combatHero.run = function(){
	if(Math.random() <= combatHero.fleeChance){
		sendMessage("You escape like a coward! Congratulations", false);
		combat.end();
	}
	else{
		sendMessage("You cannot escape!");
	}
	dragonSmasher.dispatchEvent(combat.hdone);
}

combatHero.levelUp = function(){
	console.log('hero gaining new level');
	hero.lvl++;
	sendMessage("You have reached the next Level.", false);
	hero.nextLvlXp =  hero.nextLvlXp * 2;
	sendMessage("xp to next level is " + hero.nextLvlXp, false);
	hero.maxDmg = 1 + combatHero.lvl + combatHero.weapon.dmgBonus; 
	hero.minDmg = 1 + hero.lvl;
	hero.maxHp += 10;
}

combatHero.checkLevel = function(){
	console.log(hero.nextLvlXp +" xp for next lvl " + hero.xp + " current xp");
	if(hero.xp >= hero.nextLvlXp){
		hero.levelUp();
	}
	else{
		console.log('no new level');
	}
}
combatHero.isAlive = function(){
	if(combatHero.hp > 0){
		return true;
	}
	else{
		return false;
	}
}

combatHero.die = function(){
	sendMessage("You have fallen in battle. You will not be remembered.", false);
	state = ENDGAME;
}

combatHero.maxDmg = combatHero.lvl + combatHero.weapon.dmgBonus + 1;
combatHero.minDmg = combatHero.lvl;
combatHero.setStats();var dragonSmasher = document.getElementById("dragonSmasher");

function buyItem(shop, item){
	return function(){
		console.log("shop = "+ shop);
		shop.items[item].buy();
	}
}

function buyWeapon(shop, weapon){
	return function(){
	console.log("shop = "+ shop);
		shop.weapons[weapon].buy();
	}
}

function useItem(item){
	return function(){
		combatHero.inventory[item].quaff();
	}
}
var inventoryMenu = {
	background : document.createElement('div'),
	weaponList : document.createElement('form'),
	itemList : document.createElement('div'),
	currentWeapon : document.createElement('div'),
	create : function(){
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'itemMenu');
		this.background.innerHTML = '<h3>ITEMS<h3>'
		this.background.appendChild(this.weaponList);
		this.background.appendChild(this.itemList);
		this.background.appendChild(this.currentWeapon);
		dragonSmasher.appendChild(this.background);
	},
	updateWeapons : function(){
		//this.weaponList.setAttribute("action","combatHero.weapons[this.selectedIndex].equip()");	
		//first remove
		while (this.weaponList.lastChild) {
    		this.weaponList.removeChild(this.weaponList.lastChild);
		}
		//then add
		var option = [];
		for(var weap = 0; weap < combatHero.weapons.length; weap++){
			option[weap] = document.createElement('input');
			option[weap].setAttribute('type', "radio");
			option[weap].setAttribute('name', "weapons");
			option[weap].setAttribute('value', weap.toString());
			option[weap].addEventListener('click', function(){
				console.log("weap is "+ weap);
				var num = weap;
				console.log(num);
				return function(){combatHero.weapons[num].equip()};
			}());
			this.weaponList.appendChild(option[weap]);
			var weapName = document.createElement('span');
			weapName.innerHTML = combatHero.weapons[weap].name + "<br>";
			this.weaponList.appendChild(weapName);
		}
	},
	updateItems : function(){
		while (this.itemList.lastChild) {
    		this.itemList.removeChild(this.itemList.lastChild);
    	}	
    	var itemButtons = [];
			var itemNo;
	
		for(itemNo = 0; itemNo < combatHero.inventory.length; itemNo++){
			itemButtons[itemNo] = document.createElement('button');
		
			itemButtons[itemNo].addEventListener('click', useItem(itemNo) ,false);		
			itemButtons[itemNo].textContent = combatHero.inventory[itemNo].name;
			this.itemList.appendChild(itemButtons[itemNo]);	
		}
	},
	sellmode : function(){
		function addSellButtons(list, inventory){
			var listArray = list.children;
		}
		addSellButtons(this.weaponList);
		addSellButtons(this.itemLIst);
	}
}

var shopPallas = {
	self : null,
	items:[smallPotion, largePotion],
	weapons:[stick, dagger, shortSword, flail, longSword],
	background : document.createElement('div'),
	itemsToBuy : document.createElement('div'),
	weaponList : document.createElement('div'),
	init : function(){
		this.self = function(){return this}();
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'shopMenu');
		this.background.innerHTML = '<h3>SHOP<h3>'		
		var weapButtons = [];
		//adding weapons
		for(var weap = 0; weap < this.weapons.length; weap++){
			weapButtons[weap] = document.createElement('button')
			weapButtons[weap].addEventListener('click', buyWeapon(shopPallas, weap),false);
			weapButtons[weap].innerHTML = this.weapons[weap].name + " price " + this.weapons[weap].cost + "gold";
			this.weaponList.appendChild(weapButtons[weap]);
		}	
		//adding items	
		var itemButtons =[];
		var itemNo;
		for(itemNo = 0; itemNo < this.items.length; itemNo++ ){
			itemButtons[itemNo] = document.createElement('button');
			itemButtons[itemNo].textContent= this.items[itemNo].name + " " + this.items[itemNo].cost + "gold";
			itemButtons[itemNo].addEventListener('click', buyItem(shopPallas, itemNo),false);			
			this.itemsToBuy.appendChild(itemButtons[itemNo]);
		}
	
		var closeShop = document.createElement('button');
		closeShop.setAttribute('onclick', 'shopPallas.close()'); // this line needs to be changed when we add more shops
		closeShop.innerHTML = "CLOSE";
		this.background.appendChild(this.weaponList);
		this.background.appendChild(this.itemsToBuy);
		this.background.appendChild(closeShop);
	},	
	open : function (){
		dragonSmasher.appendChild(this.background);
		state = SHOP;
	},
	close : function(shopMenu){
		dragonSmasher.removeChild(this.background);
		dialogBox.style.zIndex = -1;
		state = TOWN;
	}
}
shopPallas.init();
inventoryMenu.create();
inventoryMenu.updateWeapons();// facing index
// 0, 1 front 2, 3 back 4, 5 left 6, 7 right

var script= {
	placeholder : "Hey buddy",
	fingerhutShop : "Buy Something Will ya!",
	blackGirl : "Let me see you dance!"	
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
	state = TALK;
	console.log("talking");
	this.talking = true;
	//physically moving the divs around
	dialogBox.style.zIndex = 4;
	dialogBox.innerHTML = "<p class='game'>" + this.message + "</p>";
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
}/* next add npc object
	have merchant or shopkeeper inherit
	look up more on inheritance
	eventPicLoaded is going to be a huge pain in the future. all asset loading will need 
	to be completely redone.
	*/

	tileSheet.addEventListener('load', eventPicLoaded , false);
	tileSheet.src="tiles_16.png";
	
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
	}combat = {
	currentEnemy : null,
	hdone  : new Event('hdone'),
	eDone : new Event('eDone'), //enemy is done.
	attachEvents : function(){
		dragonSmasher.addEventListener('hdone',  combat.enemyTurn);	 // hero turn done
		dragonSmasher.addEventListener('eDone',  combat.heroTurn);//end enemy turn
		
		fightButton.addEventListener('click', combatHero.attack),//hero attack
		runButton.addEventListener('click', combatHero.run); 
	
	},
	init : function(){
		fightButton.style.display = "inline";
		runButton.style.display = "inline";
		console.log('init COMBAT');
		console.log('hello');
		this.currentEnemy = enemies.selectBaddy();
		this.currentEnemy.greeting();
		this.currentEnemy.draw();
		console.log("enemy hp = " + this.currentEnemy.hp);
		this.attachEvents();
	},
	end : function(how){
		//how is a string that says how combat ended
		console.log('ending combat');
		this.currentEnemy.die();
		state = OVERWORLD;
		fightButton.style.display = "none";
		runButton.style.display = "none";
		window.setTimeout(function(){dialogBox.style.zIndex = -1}, 1000); 
	},
	giveTreasure : function(){
		var xpGain = combat.CurrentEnemy.hp;
		var goldGain = combat.currentEnemy.maxDmg;
		sendMessage( "you got " + xpGain + "xp and " + goldGain + " gold.", false );
		combatHero.xp += xpGain;
		combatHero.gold += goldGain;
		setStats();
	},
	heroTurn : function(){
		combatHero.setStats();
		if(combatHero.isAlive()){
			fightButton.disabled = false;
			runButton.disabled= false;
		}
		else{
			combatHero.die();
			combat.end();
			combat.currentEnemy.die();
		}
	},
	enemyTurn : function(){
		//check if enemy alive
		//disable fight button
		fightButton.disabled = true;
		runButton.disabled = true;
			if(combat.currentEnemy.isAlive()){
				//attack
				var  effectLevel =  combat.currentEnemy.takeTurn();
				//effects?
			}
			else{
				//treasure
				combat.end();
			}
		// effects
		//fire done event:
		dragonSmasher.dispatchEvent(combat.eDone);
	}
}

function handleEnd(){
	sendMessage("Another nameless warrior tries his luck. Click fight to begin your adventure. Click on the shop to buy supplies for your journey.", true);
}
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
		hCtx.fillStyle = "#567DCE";
		hCtx.fillRect(150, 50, 400, 400);
		hCtx.fillStyle = "#346524";
		hCtx.fillRect(150, 300, 400, 150);	
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
enemies.loadPics();var hero= {
		x : 5 * DEST_WIDTH,
		y : 5 * DEST_HEIGHT,
		tilePos : [5,5],
		targetTile : [5,5],
		targetTileValue : map.layout[5][5],
		moveStyle : "background",
		speed : 16,
		distanceTravelled : 0,
		direction : "stop",
		nextDirection : "stop",
		action : false,
		/* frame order: walk down walk up walk left walk right */
		currentFrame : 0,
		frames:[
			new Frame(0,1), new Frame(1,1),
			new Frame(2,1), new Frame(3,1),
			new Frame(4,1), new Frame(6,1),
			new Frame(5,1), new Frame(7,1) 
		],
		getMoveStyle : function(){		
			if(hero.direction == "down" && 
			(hero.targetTile[1] >= NUM_ROWS - SCREEN_BORDER || hero.targetTile[1] <= SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "up" &&
			(hero.targetTile[1] >= NUM_ROWS - SCREEN_BORDER - 1 || hero.targetTile[1] < SCREEN_BORDER)){ 
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "right"  && 
			(hero.targetTile[0] >= NUM_COLS - SCREEN_BORDER  || hero.targetTile[0] <= SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "left" &&
			(hero.targetTile[0] >= NUM_COLS - SCREEN_BORDER - 1|| hero.targetTile[0] < SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else{
				hero.moveStyle = "background";
			}
		},
		getTargetTile : function(){
			if(hero.direction == "down"){
				hero.targetTile =[hero.tilePos[0],hero.tilePos[1]+1];
			}
			else if(hero.direction == "up"){
				hero.targetTile =[hero.tilePos[0],hero.tilePos[1]-1];
			}
			else if(hero.direction == "right"){
				hero.targetTile =[hero.tilePos[0] + 1,hero.tilePos[1]];
			}
			else if(hero.direction == "left"){
				hero.targetTile =[hero.tilePos[0] -1 ,hero.tilePos[1]];
			}
			hero.targetTileValue = map.layout[hero.targetTile[1]][hero.targetTile[0]];		//reversed because row comes first
		},
		updateTravelVariables : function(){
			hero.tilePos = hero.targetTile;
			hero.direction = hero.nextDirection;
			hero.distanceTravelled = 0;
		},
		tileReached : function(){
			if(hero.distanceTravelled == DEST_WIDTH ||
			  (hero.tilePos[0] == hero.targetTile[0] && hero.tilePos[1] == hero.targetTile[1])
			){
				return true;
			}
			else{
				return false;
			}
		},
		draw : function(){	
			hero.frames[hero.currentFrame].draw(hero.x, hero.y);			
		},
		selectFrame : function(){
			if(hero.direction == "down"){
				if(hero.currentFrame != 0){
					hero.currentFrame = 0;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			
			if(hero.direction == "up"){
				if(hero.currentFrame != 2){
					hero.currentFrame = 2;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			if(hero.direction == "left"){
				if(hero.currentFrame != 4){
					hero.currentFrame = 4;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			if(hero.direction == "right"){
				if(hero.currentFrame != 6){
					hero.currentFrame = 6;
				}
				else{
					hero.currentFrame ++;
				}
			}		
		},
		updatePosition : function(){
			if(hero.direction != "stop"){
				hero.distanceTravelled += hero.speed;
			}
			if(hero.direction == "down"){
				if(hero.moveStyle == "hero"){
					hero.y += hero.speed;
				}
				else{
					map.y -=hero.speed;
					context.translate(0, -hero.speed);
				}
			}
			if(hero.direction == "up"){
				if(hero.moveStyle == "hero"){
					hero.y -= hero.speed;
				}
				else{
					map.y += hero.speed;
					context.translate(0, hero.speed);		
				}
			}
			if(hero.direction == "right"){
				if(hero.moveStyle == "hero"){
					hero.x += hero.speed;
				}
				else{
					map.x -= hero.speed;
					context.translate(-hero.speed, 0);
				}
			}
			if(hero.direction == "left"){
				if(hero.moveStyle == "hero"){
					hero.x -= hero.speed;
				}
				else{
					map.x += hero.speed;
					context.translate(hero.speed, 0);
				}
			}		
		}
	}
	hero.checkTargetTile = function(){
		if(!map.tileList[hero.targetTileValue].passable){
			hero.direction = 'stop';
			hero.targetTile = hero.tilePos;
		}
		if(map.NpcList){
			for(var npc = 0; npc < map.NpcList.length; npc++){
				if( hero.targetTile[0] == map.NpcList[npc].tilePos[0] &&
					hero.targetTile[1] == map.NpcList[npc].tilePos[1]){
					hero.direction = "stop";
					hero.targetTile = hero.tilePos;
				}
			}
		}
	}
	
	hero.tryAction = function(){
		// attempts to do whatever actions make sense in context when spacebar is pressed
		// resets hero.action to false when finished;
		console.log("state 10 = town check " + state + " hero.action " + hero.action);
		if(dialogBox.style.zIndex == 4){
			dialogBox.style.zIndex = -1;
		}
		if(state == TOWN){
			console.log('looking for people to talk to.');
			if( hero.currentFrame == 0 || //check facing down
				hero.currentFrame == 1){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] + 1 == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 2 || //check facing up
				hero.currentFrame == 3){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] - 1 == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 4 || //check facing right
				hero.currentFrame == 5){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] - 1 == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 6 || //check facing left
				hero.currentFrame == 7){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] + 1 == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
		}
		else if(state == TALK){ //NPC puts you into talk state.
			//right now if you leave town with dialog box in front won't be able to get it 
			//to go away until you enter town again.
			dialogBox.style.zIndex = -1;
			state = TOWN;		
		}
		else if(state == BATTLE){
			state = OVERWORLD;
		}
		hero.action = false;
	}
	
	hero.move = function(){
		if(hero.tileReached()){ 
			map.checkSpecialTiles();			
			hero.updateTravelVariables();			
			if(keys.downUp && keys.upUp && keys.leftUp && keys.rightUp){
				hero.direction = 'stop';				
			}
			if(hero.action){
				console.log("about to try action " + hero.action);
				hero.tryAction();
			}		
			else{
				if(state == TOWN || state == OVERWORLD){
					hero.getTargetTile();
					hero.getMoveStyle();
				}
			}
			hero.selectFrame();
			hero.checkTargetTile();
		}
		else{
			hero.selectFrame(); 
			hero.updatePosition();		
		}
	} 