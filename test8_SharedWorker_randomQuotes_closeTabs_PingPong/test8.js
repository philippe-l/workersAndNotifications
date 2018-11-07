// window.name = "testWorker5";
const windowRef = Window.window;
var myWorker = null;

if (window.SharedWorker) { // Check if Browser supports the Worker api.
	console.log('Workers works');
    myWorker = new SharedWorker("worker_test8.js", 'notificationPoolingRandomQuotes');
    console.log('myWorker');
    console.log(myWorker);
    console.log(myWorker.port);
    console.log('/myWorker');
    // myWorker.port.postMessage('Mon message au worker'); // Sending message as an array to the worker
    // myWorker.port.postMessage(['a', 'b', 'c']); // Sending message as an array to the worker
    myWorker.port.postMessage(['startNotifTimerWorker', windowRef]); // Sending message as an array to the worker

    myWorker.port.onmessage = function(e) {
        const workerMessage = e.data;
        console.log('Message received from worker' + e);
        console.log("workerMessage " + workerMessage);
        if (typeof workerMessage === 'string' && workerMessage === 'AreYouAlive?') {
            console.log('I am alive yes');
            console.log('posting pong....');
            myWorker.port.postMessage('IAmAlive');
            console.log('pong posted');
        }
        if (Array.isArray(workerMessage)) {
            if (workerMessage[0] === 'postNotification'){
                notif(workerMessage[1]);
            }
        }
    };

    window.onclose = () => {
        console.log('closing window 26');
        myWorker.port.postMessage('closeWindow');
    }

} else {
    console.log('Workers doesn\'t work... Too bad !');
}

window.onclose = () => {
    //close wind
    console.log('closing window 35');
    if (myWorker) myWorker.port.postMessage('closeWindow'); // Sending message as an array to the worker
}

function notif (workerMessage){
    console.log('exec notif func');
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        //var notification = new Notification("Hi there my notif has been launched by webWorker message!");
        createNotification(workerMessage);
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            // var notification = new Notification("Hi there my notif has been launched by webWorker message!");
            createNotification(workerMessage);
        }
    });
    }
}

function createNotification(workerMessage) {
    var notification = new Notification(workerMessage);
    notification.onclick = function(event) {
        event.preventDefault(); // empêche le navigateur de donner le focus à l'onglet relatif à la notification
        // window.open('http://www.mozilla.org', '_blank');
        window.focus();
    }
}