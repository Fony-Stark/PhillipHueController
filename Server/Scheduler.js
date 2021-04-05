class Scheduler {
	constructor(){
		this.quequeLength = 0;
		this.alarms = [];
	}

	checkAlarms(){
		let now = Data.getTime();
		for(let i = 0; i < this.quequeLength; i++){
			if(this.alarms[i].experationDate - now <= 0){
				if(this.alarms[i].executions < this.alarms[i].lifespan){
					this.alarms[i].execute();
					this.alarms[i].executions++;
				} else {
					this.alarms[i].expired = true;
				}
			}
		}
	}

	removeAlarms(){
		for(let i = this.quequeLength - 1; i >= 0; i--){
			if(this.alarms[i].expired){
				this.removeAlarm(i);
			}
		}
	}

	addAlarm(alarm){
		this.alarms.append(alarm);
		this.quequeLength++;
	}

	removeAlarm(index){
		this.alarms[index].splice(index, 1);
	}
}

module.exports = { Scheduler };