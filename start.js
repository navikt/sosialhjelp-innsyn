var os = require('os');
var exec = require('child_process').exec;

var runString = "";
console.log("Ditt OS er " + os.type())
if (os.type() === 'Windows_NT')
    runString = "set PORT=3002 && craco start --color";
else
    runString = "PORT=3002 craco start --color";

var cracoStart = exec(runString);
console.log("Starter med commando: " + runString + "\n");

cracoStart.stdout.on('data', function (data) {
    console.log(data.toString());
});

cracoStart.stderr.on('data', function (data) {
    console.log('ERROR: ' + data.toString());
});

cracoStart.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
});