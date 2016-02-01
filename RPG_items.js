
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
			//console.log('selling '+ this.name);
			//console.log('index ' + combatHero.inventory.indexOf(this));
			combatHero.weapons.splice(combatHero.weapons.indexOf(this), 1);
			if(combatHero.weapons.indexOf(this)== -1 && combatHero.weapon == this){
				this.unequip();
				noWeapon.equip();
			}
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
	
	healingPotion.prototype.remove = function(){
		combatHero.inventory.splice(combatHero.inventory.indexOf(this), 1);
		inventoryMenu.updateItems();
	}
	
	healingPotion.prototype.quaff = function(){
		combatHero.hp += this.strength;
		if(combatHero.hp > combatHero.maxHp){
			combatHero.hp = combatHero.maxHp;
		}
		
		combatHero.inventory.splice(combatHero.inventory.indexOf(this), 1);
		combatHero.setStats();
		inventoryMenu.updateItems();
		if(state === TOWN || state === OVERWORLD || state === DUNGEON){
			dialogBox.open();
		}
		sendMessage("You quaff the "+ this.name + " and gain " + this.strength + "hp", false);
		if(state === BATTLE){
			console.log('potion in battle');
			combat.hdone.result = 'item used';
			dragonSmasher.dispatchEvent(combat.hdone);
		}	
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
var bomb = Object.create(new healingPotion('Bomb',   10, 15));
bomb.quaff = function(){
	if(state !== BATTLE){
		return;
	}
	else{
		this.remove();
		combat.currentEnemy.hp -= this.strength;
		sendMessage("BOOM! " + this.strength + " damage!", true);
		combat.hdone.result = 'hit';
		dragonSmasher.dispatchEvent(combat.hdone);
	}
}
// Stock for shops in the world
fingerhutWeapons = [stick, dagger];
fingerhutItems = [smallPotion, largePotion];
pallasWeapons = [shortSword, flail, longSword];
pallasItems = [smallPotion, largePotion];
