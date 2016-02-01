console.log("combat hero");

combatHero = {
	weapon : noWeapon,
	maxHp : 10,
	hp : 10,
	xp : 0,
	nextLvlXp : 10,
	lvl : 1,
	gold : 100,
	attack : 0.5,
	maxDmg : 1 + this.lvl, // + this.weapon.dmgBonus, 
	minDmg :1, // this.lvl,
	weapons : [noWeapon],
	inventory : [],
	fleeChance : 0,
	setStats : function(){
		statsBox.innerHTML  = "<span>Level: " + combatHero.lvl + "</span><br>";
		statsBox.innerHTML += "<span>XP: " + combatHero.xp + "</span><br>";
		statsBox.innerHTML += "<span>HP: " + combatHero.hp + "/" + combatHero.maxHp + "</span><br>";
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
		combat.result = "hit";
	}
	else{
		combat.result = "miss";
	}
	combat.handleResult("hero");
}

combatHero.run = function(){
	if(Math.random() <= combatHero.fleeChance + combat.currentEnemy.escChance){
		sendMessage("You escape like a coward! Congratulations", false);
		combat.result = "run succeed";
	}
	else{
		sendMessage("You cannot escape!");
		combat.result = "run fail";
	}
	combat.handleResult("hero");
}

combatHero.levelUp = function(){
	console.log('hero gaining new level');
	combatHero.lvl++;
	sendMessage("You have reached the next Level.", false);
	combatHero.nextLvlXp =  combatHero.nextLvlXp * 2;
	sendMessage("xp to next level is " + combatHero.nextLvlXp, false);
	combatHero.maxDmg = 1 + combatHero.lvl + combatHero.weapon.dmgBonus; 
	combatHero.minDmg = 1 + combatHero.lvl;
	combatHero.maxHp += 4;
	combatHero.setStats();
}

combatHero.checkLevel = function(){
	//console.log(hero.nextLvlXp +" xp for next lvl " + hero.xp + " current xp");
	if(combatHero.xp >= combatHero.nextLvlXp){
		combatHero.levelUp();
	}
	else{
		console.log('no new level');
	}
}
combatHero.isAlive = function(){
	if(combatHero.hp > 0){ // This whole function could be return combatHero.hp > 0;
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