var Lime = require('lime-js');
var moment = require('moment');

// menu inicial
exports.menuInicial = function(destinatario, user) {
    return {
        "id": Lime.Guid(),
        "to": destinatario,
        "type": "application/vnd.lime.select+json",
        "content": {
            "scope": "immediate",
            "text": "Seja bem vindo(a) " + user.fullName ,
            "options": [
                {
                    "text": "Cursos",
                    "type": "application/vnd.cotemig.cursos+json",
                    "value": {}
                },
                {
                    "text": "Dúvidas",
                    "type": "application/vnd.baanko.indicacao+json",
                    "value": {}
                }
            ]
        }
    };
};

