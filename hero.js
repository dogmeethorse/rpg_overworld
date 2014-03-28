var hero= {
		x : 5 * DEST_WIDTH,
		y : 5 * DEST_HEIGHT,
		tilePos : [5,5],
		targetTile : [5,5],
		targetTileValue : map.layout[5][5],
		moveStyle : "background",
		speed : 16,
		distanceTravelled : 0,
		direction : "stop",
		nextDirection : "stop",
		action : false,
		/* frame order: walk down walk up walk left walk right */
		currentFrame : 0,
		frames:[
			new Frame(0,1), new Frame(1,1),
			new Frame(2,1), new Frame(3,1),
			new Frame(4,1), new Frame(6,1),
			new Frame(5,1), new Frame(7,1) 
		],
		getMoveStyle : function(){		
			if(hero.direction == "down" && 
			(hero.targetTile[1] >= NUM_ROWS - SCREEN_BORDER || hero.targetTile[1] <= SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "up" &&
			(hero.targetTile[1] >= NUM_ROWS - SCREEN_BORDER - 1 || hero.targetTile[1] < SCREEN_BORDER)){ 
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "right"  && 
			(hero.targetTile[0] >= NUM_COLS - SCREEN_BORDER  || hero.targetTile[0] <= SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else if(hero.direction == "left" &&
			(hero.targetTile[0] >= NUM_COLS - SCREEN_BORDER - 1|| hero.targetTile[0] < SCREEN_BORDER)){
				hero.moveStyle = "hero";
			}
			else{
				hero.moveStyle = "background";
			}
		},
		getTargetTile : function(){
			if(hero.direction == "down"){
				hero.targetTile =[hero.tilePos[0],hero.tilePos[1]+1];
			}
			else if(hero.direction == "up"){
				hero.targetTile =[hero.tilePos[0],hero.tilePos[1]-1];
			}
			else if(hero.direction == "right"){
				hero.targetTile =[hero.tilePos[0] + 1,hero.tilePos[1]];
			}
			else if(hero.direction == "left"){
				hero.targetTile =[hero.tilePos[0] -1 ,hero.tilePos[1]];
			}
			hero.targetTileValue = map.layout[hero.targetTile[1]][hero.targetTile[0]];		//reversed because row comes first
		},
		updateTravelVariables : function(){
			hero.tilePos = hero.targetTile;
			hero.direction = hero.nextDirection;
			hero.distanceTravelled = 0;
		},
		tileReached : function(){
			if(hero.distanceTravelled == DEST_WIDTH ||
			  (hero.tilePos[0] == hero.targetTile[0] && hero.tilePos[1] == hero.targetTile[1])
			){
				return true;
			}
			else{
				return false;
			}
		},
		draw : function(){	
			hero.frames[hero.currentFrame].draw(hero.x, hero.y);			
		},
		selectFrame : function(){
			if(hero.direction == "down"){
				if(hero.currentFrame != 0){
					hero.currentFrame = 0;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			
			if(hero.direction == "up"){
				if(hero.currentFrame != 2){
					hero.currentFrame = 2;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			if(hero.direction == "left"){
				if(hero.currentFrame != 4){
					hero.currentFrame = 4;
				}
				else{
					hero.currentFrame ++;
				}		
			} 
			if(hero.direction == "right"){
				if(hero.currentFrame != 6){
					hero.currentFrame = 6;
				}
				else{
					hero.currentFrame ++;
				}
			}		
		},
		updatePosition : function(){
			if(hero.direction != "stop"){
				hero.distanceTravelled += hero.speed;
			}
			if(hero.direction == "down"){
				if(hero.moveStyle == "hero"){
					hero.y += hero.speed;
				}
				else{
					map.y -=hero.speed;
					context.translate(0, -hero.speed);
				}
			}
			if(hero.direction == "up"){
				if(hero.moveStyle == "hero"){
					hero.y -= hero.speed;
				}
				else{
					map.y += hero.speed;
					context.translate(0, hero.speed);		
				}
			}
			if(hero.direction == "right"){
				if(hero.moveStyle == "hero"){
					hero.x += hero.speed;
				}
				else{
					map.x -= hero.speed;
					context.translate(-hero.speed, 0);
				}
			}
			if(hero.direction == "left"){
				if(hero.moveStyle == "hero"){
					hero.x -= hero.speed;
				}
				else{
					map.x += hero.speed;
					context.translate(hero.speed, 0);
				}
			}		
		}
	}
	hero.checkTargetTile = function(){
		if(!map.tileList[hero.targetTileValue].passable){
			hero.direction = 'stop';
			hero.targetTile = hero.tilePos;
		}
		for(var npc = 0; npc < map.NpcList.length; npc++){
			if( hero.targetTile[0] == map.NpcList[npc].tilePos[0] &&
				hero.targetTile[1] == map.NpcList[npc].tilePos[1]){
				hero.direction = "stop";
				hero.targetTile = hero.tilePos;
			}
		}
	}
	
	hero.tryAction = function(){
		// attempts to do whatever actions make sense in context when spacebar is pressed
		// resets hero.action to false when finished;
		console.log("state 10 = town check " + state + " hero.action " + hero.action);
		if(dialogBox.style.zIndex == 4){
			dialogBox.style.zIndex = -1;
		}
		if(state == TOWN){
			console.log('looking for people to talk to.');
			if( hero.currentFrame == 0 || //check facing down
				hero.currentFrame == 1){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] + 1 == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 2 || //check facing up
				hero.currentFrame == 3){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] - 1 == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 4 || //check facing right
				hero.currentFrame == 5){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] - 1 == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
			if( hero.currentFrame == 6 || //check facing left
				hero.currentFrame == 7){
				for(var npc = 0; npc < map.NpcList.length; npc++){
					if( hero.tilePos[0] + 1 == map.NpcList[npc].tilePos[0] &&
						hero.tilePos[1] == map.NpcList[npc].tilePos[1]){
						map.NpcList[npc].talk();
					}
				}
			}
		}
		else if(state == TALK){ //NPC puts you into talk state.
			//right now if you leave town with dialog box in front won't be able to get it 
			//to go away until you enter town again.
			dialogBox.style.zIndex = -1;
			state = TOWN;		
		}
		hero.action = false;
	}
	
	hero.move = function(){
		if(hero.tileReached()){ 
			map.checkSpecialTiles();			
			hero.updateTravelVariables();			
			if(keys.downUp && keys.upUp && keys.leftUp && keys.rightUp){
				hero.direction = 'stop';				
			}
			if(hero.action){
				console.log("about to try action " + hero.action);
				hero.tryAction();
			}		
			else{
				if(state == TOWN || state == OVERWORLD){
					hero.getTargetTile();
					hero.getMoveStyle();
				}
			}
			hero.selectFrame();
			hero.checkTargetTile();
		}
		else{
			hero.selectFrame(); 
			hero.updatePosition();		
		}
	} 