const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function () {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382)
    expect(rover.generatorWatts).toEqual(110);
    expect(rover.mode).toEqual('NORMAL');
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Test message with two commands');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(2);
  });

  it("responds correctly to the status check command", function () {
    let commands = new Command('STATUS_CHECK');
    let message = new Message('Test message with status check command', [commands]);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    let roverStatus =response.results[0].roverStatus;
    expect(roverStatus.mode).toEqual('NORMAL');
    expect(roverStatus.generatorWatts).toEqual(110);
    expect(roverStatus.position).toEqual(98382);

  });

  it("responds correctly to the mode change command", function () {
    let command = new Command('MODE_CHANGE', 'LOW_POWER');
    let message = new Message('Test message with mode change command', [command]);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBeTruthy;
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'),
                    new Command('MOVE', 3579),
                    new Command('STATUS_CHECK')];
    let message = new Message('Test message with Move command in Low Power', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[1].completed).toBeFalsy;
    expect(response.results[2].roverStatus.position).toEqual(98382);
    
  });  

  it("responds with the position for the move command", function () {
    let commands = [new Command('MOVE', 3579),
                    new Command('STATUS_CHECK')];
    let message = new Message('Test message with Move command and Status check', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBeTruthy;
    expect(response.results[1].roverStatus.position).toEqual(3579);
    
  });  


});
