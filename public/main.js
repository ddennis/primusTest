/**
 * Created by Fantastisk on 04-05-2015.
 */


var btn = document.getElementById("btn")
var primus = new Primus();

btn.onclick = function(){
    primus.write("Send to server");
};

primus.on('data', function received(data) {
    toastr.info('data = ', data)
});

primus.on('open', function received(data) {
    toastr.info('open')
});