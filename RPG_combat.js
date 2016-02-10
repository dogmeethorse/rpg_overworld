var enemiesKilled = 0;
var timesDead = 0
combat = {
	currentEnemy : null,
	oldState : null,
	result  : "", // 
	//edone : new Event('eDone'), //enemy is done.
	attachEvents : function(){
		fightButton.addEventListener('click', combatHero.attack),//hero attack
		runButton.addEventListener('click', combatHero.run); 
	},
	init : function(){
		combat.oldState = state;
		state = BATTLE;
		fightButton.style.display  = "inline";
		runButton.style.display    = "inline";
		fightButton.disabled = false;
		runButton.disabled   = false;
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
			enemiesKilled++;
			this.currentEnemy.die();
		}
		else{
			console.log("failed to pick enemy");
		}
		fightButton.style.display = "none";
		runButton.style.display = "none";
		state = combat.oldState;
		combat.oldState = null;
		dialogBox.open();
	},
	giveTreasure : function(){
		var xpGain = combat.currentEnemy.xp;
		var goldGain = combat.currentEnemy.maxDmg;
		sendMessage( "you got " + xpGain + "xp and " + goldGain + " gold.", false );
		combatHero.xp += xpGain;
		combatHero.gold += goldGain;
		combatHero.setStats();
		//combat.end();
	},
	heroTurn : function(){
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
		console.log(combat.result);
		//check if enemy alive
		//disable fight button
		fightButton.disabled = true;
		runButton.disabled = true;
		var  effectLevel =  combat.currentEnemy.takeTurn();
		combatHero.setStats();
		// effects
		//fire done event:
		combat.handleResult("enemy");
	},
	handleResult : function(actor){
		console.log(combat.result);
		function handleHeroResult(){
			if(combat.result == "hit"){
				if(combat.currentEnemy.isAlive()){
					combat.enemyTurn();
				}
				else{
					combat.giveTreasure();
					combatHero.checkLevel();
					combat.end();
				}
			}
			else if(combat.result == "miss"){
				combat.enemyTurn();
			}
			else if(combat.result == "run succeed"){
				combat.end('run');
			}
			else if(combat.result == "run fail"){
				combat.enemyTurn();
			}
			else if(combat.result === "item used"){
				combat.enemyTurn();
			}
		}
		function handleEnemyResult(){
			if(combatHero.isAlive()){
				combat.heroTurn();
			}
			else{
				handleDefeat();
			}
		}
		if(actor == "hero"){
			handleHeroResult();
		}
		else if (actor == "enemy"){
			handleEnemyResult();
		}
	}
}

function handleDefeat(){
	console.log("handling end enemies killed = " + enemiesKilled);
	combat.end();
	timesDead++;
	if(combat.currentEnemy != dragon){
		sendMessage("This is way to Stressful. You feel yourself passing out.", false);
		state = PASSEDOUT;
		window.setTimeout( wakeUp.start, 4000);
	}
}
