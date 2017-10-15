var Lime = require('lime-js');
var menu = require('../menu/menu');

exports.init = function(message, client, user) {

    // se o conteudo da mensagem for init mostra as mensagens iniciais
    //var conteudo = message.content.toLowerCase();

    setTimeout(function() {
        client.sendMessage(menu.menuInicial(message.from, user));
    }, 1000);

    // interrompe a execucao de outros receiver
    return false;
};
