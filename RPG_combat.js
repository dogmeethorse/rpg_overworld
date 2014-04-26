combat = {
	currentEnemy : null,
	done  : new Event('done'),
	eDone : new Event('eDone'), //enemy is done.
	attachEvents : function(){
		fightButton.addEventListener(  'done',  combat.enemyTurn);	 // hero turn done
		fightButton.addEventListener(  'click', combatHero.attack),//hero atttack 
		dragonSmasher.addEventListener('eDone',  combat.heroTurn);//end enemy turn
	},
	init : function(){
		fightButton.style.display = "inline";
		console.log('init COMBAT');
		console.log('hello');
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
		fightButton.style.display = "none";
		dialogBox.style.zIndex = -1; // should change
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
		combatHero.setStats();
		if(combatHero.isALive()){
			//enable fight button
		}
		else{
			combatHero.die();
			combat.end();
		}
	},
	enemyTurn : function(){
		//check if enemy alive
		//disable fight button
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
