function GameKernel(){

// Break Value
var newLine = "<br/>";
var GK= this;
//Used for using arrow keys ^ v to go over sent commands history instead of retyping
var cmdHistory = []
var cursor = -1

//Holds all commands
commands ={}

//Holds all events
var eventTable = {}

//when a module decides to prompt the user, it is saved in here, that way, the user can answer and the result will transfered to that module instead of default
var pendingInputs =[]

$( document ).ready(function() {
    $('.console-input').on('keydown', async function(event) {
      if (event.which === 38) {
        // Up Arrow
        cursor = Math.min(++cursor, cmdHistory.length - 1)
        $('.console-input').val(cmdHistory[cursor])
      } else if (event.which === 40) {
        // Down Arrow
        cursor = Math.max(--cursor, -1)
        if (cursor === -1) {
          $('.console-input').val('')
        } else {
          $('.console-input').val(cmdHistory[cursor])
        }
      } else if (event.which === 13) {
        event.preventDefault();
        cursor = -1
        let text = input()
        cmdHistory.unshift(text)
        if(pendingInputs.length > 0) {
          await pendingInputs.pop()(text);
        }
        else{await GK.processCommand(text)}

      }
    });
});


// Set Focus to Input
$('.console').click(function() {
  $('.console-input').focus()
})


GK.registerCommand = function (name,handler,docs="No help is available for this command, sorry"){
  if(commands[name]){
    console.error("Already have a command with name " + name);
    return;
  }
  commands[name]={};
  commands[name]["handler"] = handler;
  commands[name]["docs"] = docs;
}

GK.processCommand =function (command){
  args = command.split(" ");
  name= args.pop();
  if(commands[name]){
      var output = commands[name]["handler"](command)
  } else{
    GK.print("Unknown command '"+ name +"'")
  }

}


GK.registerEventHook =function (name,callback){
  eventTable[name] = callback;
}

GK.fireEvent =function (name,details={}){
  eventTable[name](details);
}

GK.nextInput = function (callback){
  return new Promise(resolve => {
      pendingInputs.push(resolve);
  });
}

// Display input to Console
var input = function () {
  var cmd = $('.console-input').val()
  $("#outputs").append("<div class='output-cmd'>" + cmd + "</div>")
  $('.console-input').val("")
  return cmd
}

// Output to Console
GK.print = function (print,newline=true) {
  console.log(print)
  $("#outputs").append(print)
  if(newline)   $("#outputs").append(newLine);
  $(".console").scrollTop($('.console-inner').height());
}


}

var GK = new GameKernel();
