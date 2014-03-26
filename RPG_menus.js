var dragonSmasher = document.getElementById("dragonSmasher");

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
		hero.inventory[item].quaff();
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
				return function(id){combatHero.weapons[num].equip()};
			}());
			this.weaponList.appendChild(option[weap]);
			var weapName = document.createElement('span');
			weapName.innerHTML = combatHero.weapons[weap].name + "<br>";
			this.weaponList.appendChild(weapName);
		}
	},
	updateItems : function(){
		while (this.weaponList.lastChild) {
    		this.itemList.removeChild(this.itemList.lastChild);
    	}	
    	var itemButtons = [];
			var itemNo;
	
		for(itemNo = 0; itemNo < hero.inventory.length; itemNo++){
			itemButtons[itemNo] = document.createElement('button');
		
			itemButtons[itemNo].addEventListener('click', useItem(itemNo) ,false);		
			itemButtons[itemNo].textContent = hero.inventory[itemNo].name;
			this.itemList.appendChild(itemButtons[itemNo]);	
		}
	}
}

var shopPallas = {
	self : null,
	items:[smallPotion, largePotion],
	weapons:[stick, dagger, shortSword, flail, longSword],
	background: document.createElement('div'),
	itemsToBuy : document.createElement('div'),
	weaponList : document.createElement('div'),
	init : function(){
		this.self = this;
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'shopMenu');
		this.background.innerHTML = '<h3>SHOP<h3>'		
		var weapButtons = [];
		//adding weapons
		for(var weap = 0; weap < this.weapons.length; weap++){
			weapButtons[weap] = document.createElement('button')
			weapButtons[weap].addEventListener('click', buyWeapon(this.self, weap),false);
			weapButtons[weap].innerHTML = this.weapons[weap].name + " price " + this.weapons[weap].cost + "gold";
			this.weaponList.appendChild(weapButtons[weap]);
		}	
		//adding items	
		var itemButtons =[];
		var itemNo;
		for(itemNo = 0; itemNo < this.items.length; itemNo++ ){
			itemButtons[itemNo] = document.createElement('button');
			itemButtons[itemNo].textContent= this.items[itemNo].name + " " + this.items[itemNo].cost + "gold";
			itemButtons[itemNo].addEventListener('click', buyItem(this.self, itemNo),false);			
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
inventoryMenu.updateWeapons();