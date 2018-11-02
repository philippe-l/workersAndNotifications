var firstWindow = null;
var workerNum = 0;

onconnect = function(e) {
    console.log('onconnect');
    console.log('workerNum = ' + workerNum);
    workerNum++;
    var port = e.ports[0];
    if (firstWindow === null) {
        console.log('firstWindow est null');
        firstWindow = port;
    }

    console.log('firstWindow');
    console.log(firstWindow);
    console.log('/firstWindow');

    // console.log(e);
    // console.log(e.ports);
    // console.log(port);
    firstWindow.onmessage = function(e) {
        console.log('port.onmessage');
        //var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
        // port.postMessage(workerResult);

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
                    getRAndomQuoteAndSendItToParentFirstWindow(firstWindow);
                    console.log('message sent from worker');
                    //firstWindow.postMessage("sendNotif");
                }, 5000);
                console.log(intervalID);
            }
        } else {
            console.log('n\'est pas un array');
            console.log(e);
        }


    }
}

function getRAndomQuoteAndSendItToParentFirstWindow(_port) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://talaikis.com/api/quotes/random/", true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var responseText = JSON.parse(xhr.responseText);
                console.log(responseText);
                console.log(JSON.strresponseText);
                _port.postMessage(responseText.quote)
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