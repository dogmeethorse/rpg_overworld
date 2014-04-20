combat = {
	currentEnemy : null,
	done  : new Event('done'),
	attachEvents : function(){
		fightButton.addEventListener(  'done',  combat.enemyTurn);	 // hero turn done
		fightButton.addEventListener(  'click', combatHero.attack),//hero atttack 
		dragonSmasher.addEventListener('done',  combat.heroTurn);//end enemy turn
	},
	init : function(){
		console.log('init COMBAT');
		this.currentEnemy = enemies.selectBaddy();
		this.currentEnemy.greeting();
		this.currentEnemy.draw();
		console.log("enemy hp = " + this.currentEnemy.hp);
		this.attachEvents();
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
		//enable fight button
	},
	enemyTurn : function(){
		//check if enemy alive
		//disable fight button
			if(combat.currentEnemy.isAlive()){
				//attack
				//effects?
			}
			else{
				//treasure
			}
		// effects
		//fire done event:
		//dragonSmasher.dispatchEvent(combat.done);
	}
}

function resolveCombat(result){
	if(result!= null){
		
		fightArea.whiteFlash();
		sounds.regHit.play();
		console.log("feedback string = " + feedback);
		
		console.log ("Enemy hp = " + current_enemy.hp);
	}
	else{
		console.log("miss");
		var feedback = "You missed the " + current_enemy.name + "!";
		//sounds.heroMiss.play();
		sendMessage(feedback, true);
		
	}
}

function handleEnd(){
	sendMessage("Another nameless warrior tries his luck. Click fight to begin your adventure. Click on the shop to buy supplies for your journey.", true);
}
