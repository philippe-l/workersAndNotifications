// window.name = "testWorker5";
const windowRef = window.window;
var myWorker = null;
if (window.SharedWorker) { // Check if Browser supports the Worker api.
	console.log('Workers works');
    myWorker = new SharedWorker("worker_test7.js", 'notificationPoolingRandomQuotes');
    console.log('myWorker');
    console.log(myWorker);
    console.log(myWorker.port);
    console.log('/myWorker');
    // myWorker.port.postMessage('Mon message au worker'); // Sending message as an array to the worker
    // myWorker.port.postMessage(['a', 'b', 'c']); // Sending message as an array to the worker
    myWorker.port.postMessage(['startNotifTimerWorker', windowRef, 'args']); // Sending message as an array to the worker

    myWorker.port.onmessage = function(e) {
		const workerMessage = e.data;
        console.log('Message received from worker');
        console.log(e);
        if (workerMessage === 'sendNotif') {
            notif(workerMessage);
        }
    };

} else {
    console.log('Workers doesn\'t work... Too bad !');
}

window.onclose = () => {
    //close wind
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