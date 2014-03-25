
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
	}
	
	Weapon.prototype.unequip = function(){
		combatHero.maxDmg -= this.dmgBonus;
		combatHero.atk -= this.attackChanceBonus;
	}
	Weapon.prototype.buy = function(){
		console.log(this);
		console.log(" buying = "+ this.name + " cost = " + this.cost);
		if(combatHero.gld >= this.cost){
			combatHero.weapons.push(new Weapon(this.name , this.dmgBonus, this.cost));
			combatHero.gld -= this.cost;		
			sendMessage("You bought a "+ this.name,true);
		}
		else{
			sendMessage("You cannot afford "+ this.name, true);
		}
		setStats();
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
		setStats();
		closeItemMenu(itemMenu);
		sendMessage("You quaff the "+ this.name + " and gain " + this.strength + "hp", false);
	}
	
	healingPotion.prototype.buy = function(){
		console.log(this);
		console.log('trying to buy potion');
		console.log("name ="+ this.name + "cost = " + this.cost);
		if(combatHero.gld >= this.cost){
			console.log("buying Potion");
			
			combatHero.inventory.push(new healingPotion(this.name , this.strength, this.cost));
			combatHero.gld -= this.cost;
			
			sendMessage("You bought a "+ this.name,true);
			
			console.log("combatHero inventory length ="+ combatHero.inventory.length);
			console.log(combatHero.inventory);
			setStats();
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
	xp : 10,
	nextLvlXp : 100,
	lvl : 1,
	gold : 100,
	attack : 0.5,
	maxDmg : 1 + this.lvl,// + this.weapon.dmgBonus, 
	minDmg : 1 + this.lvl -1,
	weapons : [noWeapon],
	inventory : []
}

combatHero.maxDmg = combatHero.lvl + combatHero.weapon.dmgBonus;