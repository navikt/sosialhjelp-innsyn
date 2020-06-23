var os = require('os');
var exec = require('child_process').exec;

var runString = "";
console.log("Du kjører på OS: " + os.type())
if (os.type() === 'Windows_NT')
    runString = "set PORT=3002 && craco start";
else
    runString = "PORT=3002 craco start";

exec(runString);
console.log("Starter med commando: " + runString);