var windowsTab = [];
// var firstCurrentActiveWindow = null;
var workerNum = 0;

onconnect = function(e) {
    console.log('onconnect');
    console.log('workerNum = ' + workerNum);
    workerNum++;
    var port = e.ports[0];
    if (windowsTab.length === 0) {
        console.log('aucune window');
        windowsTab.push(port);
    } else {
        //recherche du port dans le tableau
        var findedWindow = windowsTab.find(_port => _port === port);
        //si le message de connexion reçu n'est pas un port connu, on stock le port
        if (!findedWindow) windowsTab.push(port);
    }

    console.log('windowsTab');
    console.log(windowsTab);
    console.log('/windowsTab');

    //on utilise toujorus le premier port disponible pour envoyer le message de notif.
    windowsTab[0].onmessage = function(e) {
        console.log('Message received from main script');
        if (Array.isArray(e.data)) {
            console.log('est un array');
            e.data.forEach(el => {
                console.log(el);
            });
            if (e.data[0] === 'startNotifTimerWorker') {
                console.log(self);

                var intervalID = self.setInterval(()=> {
                    // this.sendNotifCommand();
                    getRAndomQuoteAndSendItToParentFirstWindow(windowsTab[0]);
                    console.log('message sent from worker');
                    //firstWindow.postMessage("sendNotif");
                }, 5000);
                console.log(intervalID);
            }
        } else {
            console.log('n\'est pas un array');
            console.log(e);
            if (e.data === 'closeWindow') {
                console.log('received closes message');
                //on supprime l'élement qui a envoyé 'close'
                windowsTab.shift();
            }
        }
    }

}

self.onerror = function (e) {
    console.log('onError');
    console.log(e);
    // on supprime l'élément en erreur.
    windowsTab.shift();
};

function getRAndomQuoteAndSendItToParentFirstWindow(_port) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://talaikis.com/api/quotes/random/", true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var responseText = JSON.parse(xhr.responseText);
                console.log(responseText);
                console.log(JSON.strresponseText);
                _port.postMessage(responseText.quote);
                // _port.onmessageerror = function() {
                //     console.log('onmessageerror fuck !')
                // };
                // _port.onmessageerror = () => {
                //     console.log('on message error !!!!');
                //     windowsTab.shift();
                // };
                // throw Error('an error occurs while sent message. Change window');
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}