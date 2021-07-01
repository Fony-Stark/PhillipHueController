const { Console } = require("node:console");

class Alarm {
	constructor(timer_in_miliseconds, number_of_uses, action){
		let date = new Date()
		this.experationDate = timer_in_miliseconds + date.getTime();
		this.lifespan = number_of_uses;
		this.executions = 0;
		this.expired = false;

		/* action = 0 Turn off light, = 1 turn on light, = 2 blink */
		this.action = action;
	}

	execute(){
		switch(this.action){
			case 0:
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			default:
				Console.log("Should never happen!\nAlarm recived action out of index");
				/* Nothing. Should never happen. */
		}

		

		this.executions++;
		if(this.executions >= this.lifespan){
			this.expired = true;
		}
	}
}

module.exports = { Alarm };