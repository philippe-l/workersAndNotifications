var windowsTab = [];
var workerNum = 0;
var messageToSend = undefined;
var checkingWindowExistence = false;

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
        console.log(windowsTab.length);
    }

    console.log('windowsTab');
    console.log(windowsTab);

    //on utilise toujorus le premier port disponible pour envoyer le message de notif.
    windowsTab[0].onmessage = function(e) {
        console.log('onmessage');
        if (Array.isArray(e.data)) {
            if (e.data[0] === 'startNotifTimerWorker') {
                //start pooling for notifications
                var intervalID = self.setInterval(()=> {
                    // this.sendNotifCommand();
                    if (!checkingWindowExistence) getRAndomQuoteAndSendItToParentFirstWindow();
                    console.log('message sent from worker');
                    //firstWindow.postMessage("sendNotif");
                }, 10000);

            }
        }
    }
}

function getRAndomQuoteAndSendItToParentFirstWindow() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://talaikis.com/api/quotes/random/", true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var responseText = JSON.parse(xhr.responseText);
                console.log(responseText);
                // check if the current first port is alive and senf the notif is it is. If not, try with the next available port in the _port tab
                // _port.postMessage(responseText.quote);
                messageToSend = responseText.quote
                checkWindowAndSendNotification();

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

function checkWindowAndSendNotification() {
    const firstWindow = windowsTab[0];
    firstWindow.postMessage('AreYouAlive?');
    firstWindow.onmessage = function(e) {
        console.log('onmessage');
        if (typeof e.data === 'string' && e.data === 'IAmAlive') {
            console.log('pong received');
            firstWindow.postMessage(['postNotification', messageToSend]);
            checkingWindowExistence = false;
            messageToSend = undefined;
        }
    }
    checkingWindowExistence = true;
    self.setTimeout(() => {
        if (messageToSend !== undefined && typeof messageToSend === 'string' && checkingWindowExistence){
            checkingWindowExistence = false;
            windowsTab.shift();
            console.log(windowsTab.length);
            console.log(windowsTab);
            checkWindowAndSendNotification();
        }
    }, 1500);
}
