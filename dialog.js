	function sendMessage(output,addOrReplace){
		dialogBox.style.zIndex = 4;
   		if(addOrReplace == true){ 		
    	   	dialogBox.innerHTML = '<span class="game">' + output + '</span>';
    	}
   		else{
    	    dialogBox.innerHTML += '<span class="game">' + output + '</span>';
    	}
    	dialogBox.scrollTop = dialogBox.scrollHeight;
	}	
	dialogBox.buffer = [];
	dialogBox.revertState = state;
	dialogBox.loadBuffer = function(){
		for(var i = 0; i < arguments.length; i ++){
			dialogBox.buffer.push(arguments[i]);
		}
	}
	
	dialogBox.clear = function(){
		dialogBox.innerHTML = "";
	}
	dialogBox.clearBuffer = function(){
		dialogBox.buffer = [];
	}
	
	dialogBox.bufferIsEmpty = function(){
		console.log('tested buffer')
		console.log(dialogBox.buffer.length);
		return (dialogBox.buffer.length < 1 || dialogBox.question);
	}
	
	dialogBox.sayNextInBuffer = function(){
		var message = dialogBox.buffer.shift()
		if(typeof message !=="string"){
			message();
		}
		else{
			sendMessage(message, false);
		}
	}
	dialogBox.enterQuestionMode = function(){
		dialogBox.question = true;
		yesButton.style.display  = "inline";
		noButton.style.display   = "inline";
	}
	
	dialogBox.leaveQuestionMode = function(){
		dialogBox.question = false;
		yesButton.style.display  = "none";
		noButton.style.display   = "none";		
	}
	
	dialogBox.close = function(){
		dialogBox.style.zIndex = -1;
		state = dialogBox.revertState;
	}
	
	dialogBox.open = function(){
		dialogBox.revertState = state;
		state = TALK;
		dialogBox.style.zIndex = 4;
	}
	
	dialogBox.isOpen = function(){
		if(dialogBox.syle.zIndex === 4){
			return true;
		}
		else{
			return false;
		}
	}