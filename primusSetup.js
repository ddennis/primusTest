
// IMPORTS
var Primus = require('primus');
var ip = require ('ip');
var os = require ('os');

// Vars
//---------------------------------------------------------------------------------------

var hostName = os.hostname();
var primus = null;
var primusAdresse = "";
var namespace = "";

// INIT
//---------------------------------------------------------------------------------------
exports.init = function (server, redisClient, port) {

// SETUP locally
//---------------------------------------------------------------------------------------

    primusAdress = "http://"+ip.address()+":"+port;
    namespace = 'metroplex' + 'localtest';
    console.log (" primusSetup.js > primusAdresse = " , primusAdress);


// SETUP PRIMUS
//---------------------------------------------------------------------------------------

    primus = new Primus(server ,{
        parser: 'JSON',
        transformer: 'faye',
        namespace: namespace,
        redis:redisClient,
        address:primusAdress,
        url:primusAdress+"/primus/omega/supreme"
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





