var dragonSmasher = document.getElementById("dragonSmasher");

function buy(thing){
	return function(){
		thing.buy();
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
	sellSign : document.createElement("h4"),

	create : function(){
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'itemMenu');
		this.background.innerHTML = '<h3>ITEMS<h3>'
		this.background.appendChild(this.weaponList);
		this.background.appendChild(this.itemList);
		this.background.appendChild(this.currentWeapon);
		this.sellSign.setAttribute('class', 'game');
		this.sellSign.innerHTML = "Selling items. Click to sell";
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
				//console.log("weap is "+ weap);
				var num = weap;
				console.log(num);
				return function(){combatHero.weapons[num].equip()};
			}());
			this.weaponList.appendChild(option[weap]);
			var weapName = document.createElement('span');
			weapName.innerHTML = combatHero.weapons[weap].name + "<br>";
			this.weaponList.appendChild(weapName);
		}
		if(state == SHOP){
			//console.log('trying to add sell buttons');
			this.handleSellMode()
		}
		else{
			//console.log('state is not shop');
		}
	},
	updateItems : function(){
		//console.log('updating items.')
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
		if( state == SHOP){
			//console.log('trying to add sell buttons');
			this.handleSellMode();
		}
		else{
			//console.log('state is not SHOP');
		}
	},
	enterSellMode : function(){
		this.background.insertBefore(this.sellSign, this.background.firstChild);
	},
	handleSellMode : function(){ // This adds a heading that says sell to the items and then changes what the button does.
		function buttonListener(list, button, inNumber){
			if(button.tagName == "INPUT"){
				return function(){
					//console.log("button = " + button);
					combatHero.weapons[inNumber].sell();
					addSellButtons(list);
					
				}
			}
			else if(button.tagName =="BUTTON"){
				return function(){
					combatHero.inventory[inNumber].sell();
					addSellButtons(list);
				}
			}
		}
		function addSellButtons(list){
		// go through the list of children; check to see if the child is a button
		// if it is than change the click to sell the item.
			//console.log(list);
			//console.log(list.length);
			var inventoryNumber = 0;
			for(var item = 0; item < list.length; item++){
				//console.log("Item = " + list[item]);
				//console.log( list[item].tagName);
				if(list[item].tagName == "INPUT" ||list[item].tagName == "BUTTON"){
					//console.log("it is input or button");
					var sellVersion = list[item].cloneNode(true);
					sellVersion.addEventListener('click', buttonListener(list, list[item], inventoryNumber) , false);
					list[item].parentNode.replaceChild(sellVersion, list[item]);
					inventoryNumber++;
				} 	
			} 
		}
		addSellButtons(this.weaponList.children);
		addSellButtons(this.itemList.children);
	},
	endSellMode : function(){
		this.background.removeChild(this.sellSign);
		this.updateWeapons();
		this.updateItems();
	}
}

var shop = {
	background : document.createElement('div'),
	itemsToBuy : document.createElement('div'),
	weaponList : document.createElement('div'),
	init : function(){
		this.background.setAttribute('class','game');
		this.background.setAttribute('id', 'shopMenu');
		this.background.innerHTML = '<h3>SHOP<h3>'		
			
		var closeShop = document.createElement('button');
		closeShop.setAttribute('onclick', 'shop.close()'); // this line needs to be changed when we add more shops// Not going to change it
		closeShop.innerHTML = "CLOSE";
		this.background.appendChild(this.weaponList);
		this.background.appendChild(this.itemsToBuy);
		this.background.appendChild(closeShop);
	},
	stock: function(shopWeapons, shopItems){
		var weapons = shopWeapons;
		var items = shopItems; 
		var weapButtons = [];
		for(var weap = 0; weap < weapons.length; weap++){
			weapButtons[weap] = document.createElement('button')
			weapButtons[weap].addEventListener('click', buy(weapons[weap]),false);
			weapButtons[weap].innerHTML = weapons[weap].name + " price " + weapons[weap].cost + "gold";
			this.weaponList.appendChild(weapButtons[weap]);
		}	
		//adding items	
		var itemButtons =[];
		var itemNo;
		for(itemNo = 0; itemNo < items.length; itemNo++ ){
			itemButtons[itemNo] = document.createElement('button');
			itemButtons[itemNo].textContent= items[itemNo].name + " " + items[itemNo].cost + "gold";
			itemButtons[itemNo].addEventListener('click', buy(items[itemNo]),false);			
			this.itemsToBuy.appendChild(itemButtons[itemNo]);
		}
	},
	unstock: function(){
		function removeStock(node){
			while(node.firstChild){
				node.removeChild(node.firstChild);
			}
		}
		removeStock(this.weaponList);
		removeStock(this.itemsToBuy);
	},
	open : function (shopWeapons, shopItems){
		state = SHOP;
		shop.stock(shopWeapons, shopItems);
		dragonSmasher.appendChild(this.background);
		inventoryMenu.enterSellMode();
		inventoryMenu.handleSellMode();

	},
	close : function(shopMenu){
		dragonSmasher.removeChild(this.background);
		this.unstock();
		state = TOWN;
		inventoryMenu.endSellMode();
		dialogBox.style.zIndex = -1;
	}
}
shop.init();
inventoryMenu.create();
inventoryMenu.updateWeapons();