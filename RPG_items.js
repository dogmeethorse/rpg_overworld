
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
			combatHero.weapons.push(new Weapon(this.name , this.dmgBonus, this.attackChanceBonus, this.cost));
			combatHero.gold -= this.cost;		
			sendMessage("You bought a " + this.name, true);
			inventoryMenu.updateWeapons();// this line should instead call a function specifically written for the shop
		}
		else{
			sendMessage("You cannot afford "+ this.name, true);
		}
		combatHero.setStats();
	}
	
	Weapon.prototype.sell = function(){
		if(this.name != "Bare Hands"){
			combatHero.weapons.splice(combatHero.inventory.indexOf(this), 1);
			inventoryMenu.updateWeapons(); //this line should instead call a function written for shopping.
			combatHero.gold += Math.floor(this.cost/2);
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
			inventoryMenu.updateItems(); // need sell function
			combatHero.setStats();
		}
		else{
			sendMessage("You cannot afford "+ this.name, true);
		}
		
	}
	healingPotion.prototype.sell = function(){
		combatHero.inventory.splice(combatHero.inventory.indexOf(this), 1);
		inventoryMenu.updateItems(); //same as for weapon need sell function
		combatHero.gold += Math.floor(this.cost/2);
		combatHero.setStats();
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
		var damage =  combatHero.dealDamage.apply(combatHero);// what? why did I do this?
		combat.currentEnemy.hp -= damage;
		var feedback = "You hit the " + combat.currentEnemy.name + " for " + damage + " damage!";
		sendMessage( feedback, true);
		combat.hdone.result = "hit";
	}
	else{
		combat.hdone.result = "miss";
	}
	dragonSmasher.dispatchEvent(combat.hdone);
}

combatHero.run = function(){
	if(Math.random() <= combatHero.fleeChance){
		sendMessage("You escape like a coward! Congratulations", false);
		combat.hdone.result = "run succeed";
		combat.end();
	}
	else{
		sendMessage("You cannot escape!");
		combat.hdone.result = "run fail";
	}
	dragonSmasher.dispatchEvent(combat.hdone);// why doesn't combat end as part handling hdone.  why do I have those things separate?
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
combatHero.setStats();