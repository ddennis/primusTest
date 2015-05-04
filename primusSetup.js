
// IMPORTS
var Primus = require('primus')
var primusEmitPlugin = require('primus-emit')
var ip = require ('ip')


var hostName = os.hostname();
console.log (" primusFan.js > hostName " , hostName)
if(hostName == "Fathead" || hostName == "Fathead-PC"  ){

} else{
    hostName = ""
}

var primus = null;

// INIT --------------------------------
exports.init = function (server, redisClient, port) {

    // saving scope
    var module = this;

// SETUP PRIMUS - WITH OPTIONS
//---------------------------------------------------------------------------------------

    var namespace = 'metroplex' + hostName;

    var SERVO_ID = ""
    if(process.env.SERVO_ID != undefined ){
        SERVO_ID = process.env.SERVO_ID
    }

    var primusAdresse = "";

    if(SERVO_ID != "" ){
        primusAdresse = "http://fan.mod.bz" + "?x-mod-servo=" +SERVO_ID
    }else{
        primusAdresse = "http://"+ip.address()+":"+port
    }


    console.log (" primusFan.js > primusAdresse " , primusAdresse)

    primus = new Primus(server ,{
        parser: 'JSON',
        transformer: 'engine.io',
        namespace: namespace,
        redis:redisClient,
        address:primusAdresse,
        url:primusAdresse+"/primus/omega/supreme"
    });



// REGISTER THE PLUGINS
//---------------------------------------------------------------------------------------
    primus.use('metroplex', require('metroplex'));
    primus.use('omega-supreme', require('omega-supreme'));
    primus.use('emit', primusEmitPlugin);



// EXPORTS PRIMUS
// ---------------------------------------------------------------------------------------

    primus.save(__dirname +'../primus.js', function save(err) {
        console.log (" primusFan.js > LIB SAVED = " );
    });

// USER CONNECTS
//---------------------------------------------------------------------------------------

    primus.on('connection', function (sp) {
        var spark = sp;

        spark.on('testdata', function message(data) {
            module.testServers(spark)
        });

    });// close connection


    primus.on('disconnection', function (spark) {
        console.log (" primusFan.js > USER DISCONNECTED = ");
    });

}; // Close init



// GET CONNNECTED USERS
//---------------------------------------------------------------------------------------

exports.testServers = function (spark) {

    primus.metroplex.servers(function (err, servers) {
        console.log("not all = ", servers);
        console.log (" primusFan.js > ------------------------------------------");
    });

    primus.metroplex.servers(function (err, servers) {

        servers.forEach(function (server) {
            primus.forward(server, {
                emit: [ "testEvent", "from server" ]

            }, function (err, data) {
                console.log (" primusFan.js > err, data = " , err, data);

            });
        });
    });

};

