
// IMPORTS
var Primus = require('primus');
var ip = require ('ip');
var os = require ('os');

// Vars
//---------------------------------------------------------------------------------------

var hostName = os.hostname();
var primus = null;
var primusAdress = "";
var namespace = "";

// INIT
//---------------------------------------------------------------------------------------
exports.init = function (server, redisClient, port) {

// SETUP locally
//---------------------------------------------------------------------------------------

    var hostName = os.hostname();
    console.log (" primusFan.js > hostName " , hostName)
    if(hostName == "Fathead" || hostName == "Fathead-PC"  ){

    } else{
        hostName = ""
    }


    var SERVO_ID = "";
    if(process.env.SERVO_ID != undefined ){

        SERVO_ID = process.env.SERVO_ID;
        primusAdress = "http://fantest-46241.onmodulus.net/" + "?x-mod-servo=" +SERVO_ID
        //primusAdress = "http://"+ip.address()+":"+port + "?x-mod-servo=" +SERVO_ID

    }else{
        primusAdress = "http://"+ip.address()+":"+port;
    }


    namespace = 'metroplex' + hostName;
    console.log (" primusSetup.js > primusAdress = " , primusAdress);
    console.log (" primusSetup.js > namespace = " , namespace);


// SETUP PRIMUS
//---------------------------------------------------------------------------------------

    primus = new Primus(server ,{
        parser: 'JSON',
        transformer: 'faye',
        namespace: namespace,
        redis:redisClient,
        address:primusAdress
        /*url:primusAdress+"/primus/omega/supreme"*/
    });


// REGISTER THE PLUGINS
//---------------------------------------------------------------------------------------
    primus.use('metroplex', require('metroplex'));
    primus.use('omega-supreme', require('omega-supreme'));


// EXPORTS PRIMUS
// ---------------------------------------------------------------------------------------

    primus.save(__dirname +'../primus.js', function save(err) {
        console.log (" primusFan.js > LIB SAVED = " );
    });


// USER CONNECTS
//---------------------------------------------------------------------------------------

    primus.on('connection', function (spark) {
        spark.on('data', function message(data) {
            primus.metroplex.servers(function (err, servers) {
                console.log (" primusSetup.js > servers  = " , servers );

                servers.forEach(function (server) {
                    primus.forward(server,
                           data
                        ,
                        function (err, data) {
                            console.log (" primusFan.js > err, data = " , err, data);
                        });
                });
            });
        });
    });// close connection

}; // close init





