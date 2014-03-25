var dragonSmasher = document.getElementById("dragonSmasher");

function buyItem(item){
	return function(){
		shopInventory[item].buy();
	}
}

function buyWeapon(weapon){
	return function(){
		shopWeapons[weapon].buy();
	}
}

function useItem(item){
	return function(){
		hero.inventory[item].quaff();
	}
}

function createItemMenu(){
	var itemMenu = document.createElement('div');
	
	itemMenu.setAttribute('class','game');
	itemMenu.setAttribute('id', 'itemMenu');
	itemMenu.innerHTML = '<h3>ITEMS<h3>'
	
	var weaponList = document.createElement('select');
	
	weaponList.setAttribute("onChange","combatHero.weapons[this.selectedIndex].equip()");
	var option = [];
	
	for(var weap = 0; weap < combatHero.weapons.length; weap++){
		option[weap] = document.createElement('option')
		option[weap].setAttribute('value', hero.weapons[weap].name);
		option[weap].innerHTML = combatHero.weapons[weap].name;
		weaponList.appendChild(option[weap]);
	}
	
	var itemList = document.createElement('div');
	var itemButtons = [];
	var itemNo;
	
	for(itemNo = 0; itemNo < hero.inventory.length; itemNo++){
		itemButtons[itemNo] = document.createElement('button');
		
		itemButtons[itemNo].addEventListener('click', useItem(itemNo) ,false);
		
		itemButtons[itemNo].textContent = hero.inventory[itemNo].name;
		itemList.appendChild(itemButtons[itemNo]);	
	}
	
	var closeItems = document.createElement('button');
	closeItems.setAttribute('onclick', 'closeItemMenu(itemMenu)');
	closeItems.innerHTML = "CLOSE";
	itemMenu.appendChild(weaponList);
	itemMenu.appendChild(itemList);
	itemMenu.appendChild(closeItems);
	
	return itemMenu;	
}

function openItemMenu(){
	fightButton.disabled = true;
	shopButton.disabled  = true;
	itemButton.disabled  = true;
	runButton.disabled   = true;
	
	itemMenu = createItemMenu();
	background.appendChild(itemMenu);
}

function closeItemMenu(itemMenu){
	background.removeChild(itemMenu);
	sendMessage("You are now wielding " + hero.weapon.name, true);
	if(state != COMBAT){
		fightButton.disabled = false;
		shopButton.disabled  = false;
		itemButton.disabled  = false;
		runButton.disabled   = false;
	}
	if(state == COMBAT){
		handleEnemy();		
	}
}

var shopPallas = {
	items:[smallPotion, largePotion],
	weapons:[stick, dagger, shortSword, flail, longSword],
	background: document.createElement('div'),
	itemsToBuy : document.createElement('div'),
	weaponList : document.createElement('div'),
	init : function(){
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'shopMenu');
		this.background.innerHTML = '<h3>SHOP<h3>'		
		var weapButtons = [];
		//adding weapons
		for(var weap = 0; weap < this.weapons.length; weap++){
			weapButtons[weap] = document.createElement('button')
			weapButtons[weap].addEventListener('click', buyWeapon(weap),false);
			weapButtons[weap].innerHTML = this.weapons[weap].name + " price " + this.weapons[weap].cost + "gold";
			this.weaponList.appendChild(weapButtons[weap]);
		}	
		//adding items	
		var itemButtons =[];
		var itemNo;
		for(itemNo = 0; itemNo < this.items.length; itemNo++ ){
			itemButtons[itemNo] = document.createElement('button');
			itemButtons[itemNo].textContent= this.items[itemNo].name + " " + this.items[itemNo].cost + "gold";
			itemButtons[itemNo].addEventListener('click', buyItem(itemNo),false);			
			this.itemsToBuy.appendChild(itemButtons[itemNo]);
		}
	
		var closeShop = document.createElement('button');
		closeShop.setAttribute('onclick', 'shopPallas.close()');
		closeShop.innerHTML = "CLOSE";
		this.background.appendChild(this.weaponList);
		this.background.appendChild(this.itemsToBuy);
		this.background.appendChild(closeShop);
	},	
	open : function (){
		this.init();
		dragonSmasher.appendChild(this.background);
	},
	close : function(shopMenu){
		dragonSmasher.removeChild(this.background);
	}
}