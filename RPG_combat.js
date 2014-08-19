combat = {
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
		fightButton.style.display  = "inline";
		runButton.style.display    = "inline";
		fightButton.disabled = false;
		runButton.disabled   = false;
		console.log('init COMBAT');
		console.log('hello');
		if(this.currentEnemy = enemies.selectBaddy()){
			this.currentEnemy.greeting();
			this.currentEnemy.draw();
			console.log("enemy hp = " + this.currentEnemy.hp);
			this.attachEvents();
		}
		else{
			console.log('failed to select a bad guy');
			combat.end();
		}
	},
	end : function(how){
		//how is a string that says how combat ended
		console.log('ending combat');
		if(this.currentEnemy){
			this.currentEnemy.die();
		}
		else{
			console.log("failed to pick enemy");
		}
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
