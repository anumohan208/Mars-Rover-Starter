
const Message = require('./message.js');
const Command = require('./command.js');
class Rover {
   // Write code here!
   constructor(position){
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts=110;
   }

   receiveMessage(message) {
      
      let response = {};
      let results = [];

      for (let command of message.commands) {

         let result = {};

         if (command.commandType === 'MODE_CHANGE') {
            this.mode = command.value;
            result.completed = true;
         } else if (command.commandType === 'STATUS_CHECK') {
            result.completed = true;
            result.roverStatus = {
               mode: this.mode,
               generatorWatts: this.generatorWatts,
               position: this.position
            };
         } else if (command.commandType === 'MOVE') {
            if (this.mode === 'NORMAL') {
               this.position = command.value;
               result.completed = true;
            } else {
               result.completed = false;
            }
         }

         results.push(result);
      }

      response["message"] = message.name;
      response["results"] = results;

      return response;

   }
}


module.exports = Rover;

let rover = new Rover(100);
    let commands = [
       new Command('MOVE', 4321),
       new Command('STATUS_CHECK'),
       new Command('MODE_CHANGE', 'LOW_POWER'),
       new Command('MOVE', 3579),
       new Command('STATUS_CHECK')
    ];
    let message = new Message('TA power', commands);
    let response = rover.receiveMessage(message);
    //console.log(response);
    console.log(JSON.stringify(response, null, 2));

    console.log(response.message)//.toEqual('TA power');
    console.log(response.results[0].completed)//.toBeTruthy();
    console.log(response.results[1].roverStatus.position)//.toEqual(4321);
    console.log(response.results[2].completed)//.toBeTruthy();
    console.log(response.results[3].completed)//.toBeFalsy();
    console.log(response.results[4].roverStatus.position)//.toEqual(4321);
    console.log(response.results[4].roverStatus.mode)//.toEqual('LOW_POWER');
    console.log(response.results[4].roverStatus.generatorWatts)//.toEqual(110);

//    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
// let message = new Message('Test message with two commands', commands);
// let rover = new Rover(98382);    // Passes 98382 as the rover's position.
// let response = rover.receiveMessage(message);

// console.log(response);