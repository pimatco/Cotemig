var MessagingHub = require('messaginghub-client');
var WebSocketTransport = require( 'lime-transport-websocket');
var Lime = require('lime-js');

var menu = require('./modules/menu/menu');
var receivers = require('./modules/receivers/init');

var client = new MessagingHub.ClientBuilder()
.withIdentifier('cotemig')
.withAccessKey('Z2x4WkZpZFVzektrM09iZjRLZGc=')
.withTransportFactory(() => new WebSocketTransport())
.build();

// var menuInicial = function() {
// 	return {};
// }
	
client.connect()
.then(() => {

	
    //
	// client.addMessageReceiver('text/plain', function(message) {
	// 	var msgInit = {
	// 		id: Lime.Guid(),
	// 		type: "text/plain",
	// 		content: "Sejá bem vindo ao bot do colégio Cotemig. ",
	// 		to: message.from
	// 	};
	// 	client.sendMessage(msgInit);
	// });

	

	// receiver para mensagens de texto
	client.addMessageReceiver("text/plain", function(message) {
        console.log(message);

        var userCommand = {
            "id": Lime.Guid(),
            "to": "postmaster@messenger.gw.msging.net",
            "method": "get",
            "uri": "lime://messenger.gw.msging.net/accounts/" + message.from.split("@")[0]
        };

        let remetente = encodeURIComponent(message.from.split('/')[0]);
        let command = {
            "id": Lime.Guid(),
            "method": "get",
            "uri": "/buckets/" + remetente
        };

        // recupera a sessao do usuario remetente para recuperar os dados armazenados na mesma
		client.sendCommand(userCommand).then(function(dataUser) {
            //console.log(dataUser);
            var infoUser = dataUser;

            // verifica o conteudo da mensagem para direcionar ao status correto
            if (message.content == "COMEÇAR"){
                receiverCadastro.cadastrar(message, client, infoUser.resource);
            } else {
                // se nao foi informada nenhuma das opcoes de menu, recupera o status do usuario
                client.sendCommand(command).then(function (result) {
                    console.log("result", result);

                    //if (infoUser){
                    switch (result.resource.sessionState) {
                        case 'fim-cadastro':
                            receivers.init(message, client, infoUser.resource);
                            break;
                        default:
                            receivers.init(message, client, infoUser.resource);
                    }
                }, function (errorCommand) {
                    // se o usuario nao possui bucket, grava o mesmo no status inicial
                    console.log(errorCommand);

                    let firstCommand = {
                        "id": Lime.Guid(),
                        "method": "set",
                        "uri": "/buckets/" + message.from.split('@')[0],
                        "type": "application/json",
                        "resource": {
                            "sessionState": " "
                        }
                    };
                    client.sendCommand(firstCommand);
                    receivers.init(message, client, infoUser.resource);
                });
            }

		}, function(error) {
            // se o messenger nao aceitou a mensagem enviada inicialmente, grava o mesmo no status inicial
            console.log(error);
		});
	});

    client.addMessageReceiver('application/vnd.baanko.inicio+json', function(message) {

        var userCommand = {
            "id": Lime.Guid(),
            "to": "postmaster@messenger.gw.msging.net",
            "method": "get",
            "uri": "lime://messenger.gw.msging.net/accounts/" + message.from.split("@")[0]
        };

        client.sendCommand(userCommand).then(function(dataUser) {
            receivers.textPlainReceiver(message, client, dataUser.resource);
        });

    });

})
.catch((err) => console.error(err));