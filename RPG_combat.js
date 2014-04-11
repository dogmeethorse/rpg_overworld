combat = {
	currentEnemy : null,
	init : function(){
		console.log('init COMBAT');
		this.currentEnemy = enemies.selectBaddy();
		this.currentEnemy.greeting();
		this.currentEnemy.draw();
		console.log("enemy hp = " + this.currentEnemy.hp);
	},
	end :function(how){
		//how is a string that says how combat ended
		console.log('ending combat');
		this.currentEnemy.die();
		state = OVERWORLD;
	},
	giveTreasure: function(){
		var xpGain = current_enemy.hp;
		var gldGain = current_enemy.maxDmg;
		sendMessage( "you got " + xpGain + "xp and " + gldGain + " gold.", false );
		hero.xp += xpGain;
		hero.gld += gldGain;
		setStats();
	},
	heroTurn : function(){
	
	},
	enemyTurn : function(){
	
	}
}

function resolveCombat(result){
	if(result!= null){
		var feedback = "You hit the " + current_enemy.name + " for " + result + " damage!"
		fightArea.whiteFlash();
		sounds.regHit.play();
		console.log("feedback string = " + feedback);
		sendMessage( feedback, true);
		console.log ("Enemy hp = " + current_enemy.hp);
	}
	else{
		console.log("miss");
		var feedback = "You missed the " + current_enemy.name + "!";
		sounds.heroMiss.play();
		sendMessage(feedback, true);
		
	}
}

function handleEnd(){
	sendMessage("Another nameless warrior tries his luck. Click fight to begin your adventure. Click on the shop to buy supplies for your journey.", true);
}
