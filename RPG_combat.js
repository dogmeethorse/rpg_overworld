combat = {
	currentEnemy : null,
	hdone  : new Event('hdone'), // hero is done
	edone : new Event('eDone'), //enemy is done.
	attachEvents : function(){
		dragonSmasher.addEventListener('hdone',  function(){combat.handleResult('hero')});	 // hero turn done
		dragonSmasher.addEventListener('eDone',  function(){combat.handleResult('enemy')});//end enemy turn
		
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
		// what we really want is for the state to pop back to OVERWORLD OR DUNGEON  AFTER DIALOG BOX IS CLOSED.
		fightButton.style.display = "none";
		runButton.style.display = "none";
		state = OVERWORLD;
		dialogBox.open();
		//window.setTimeout(dialogBox.close, 1000); // we want to get rid of this
	},
	giveTreasure : function(){
		var xpGain = combat.currentEnemy.xp;
		var goldGain = combat.currentEnemy.maxDmg;
		sendMessage( "you got " + xpGain + "xp and " + goldGain + " gold.", false );
		combatHero.xp += xpGain;
		combatHero.gold += goldGain;
		combatHero.setStats();
		combat.end();
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
		console.log(combat.hdone.result);
		//check if enemy alive
		//disable fight button
		fightButton.disabled = true;
		runButton.disabled = true;
		var  effectLevel =  combat.currentEnemy.takeTurn();
		combatHero.setStats();
		// effects
		//fire done event:
		dragonSmasher.dispatchEvent(combat.edone);
	},
	handleResult : function(actor){
		console.log(combat.hdone.result);
		function handleHeroResult(){
			if(combat.hdone.result == "hit"){
				if(combat.currentEnemy.isAlive()){
					combat.enemyTurn();
				}
				else{
					combat.giveTreasure();
					combatHero.checkLevel();
					combat.end();
				}
			}
			else if(combat.hdone.result == "miss"){
				combat.enemyTurn();
			}
			else if(combat.hdone.result == "run succeed"){
				combat.end('run');
			}
			else if(combat.hdone.result == "run fail"){
				combat.enemyTurn();
			}
			else if(combat.hdone.result === "item used"){
				combat.enemyTurn();
			}
		}
		
		function handleEnemyResult(){
			if(combatHero.isAlive()){
				combat.heroTurn();
			}
			else{
				handleEnd();
			}
		}
		if(actor == "hero"){
			handleHeroResult();
		}
		else if (actor == "enemy"){
			handleEnemyResult();
		}
		combat.hdone.result = null;
		combat.edone.result = null;
	}
}

function handleEnd(){
	sendMessage("You are dead", false);
}
