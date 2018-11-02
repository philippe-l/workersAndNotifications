window.name = "testWorker4";
const windowName = window.name;

if (window.Worker) { // Check if Browser supports the Worker api.
	console.log('Workers works');
	var myWorker = new Worker("worker_test4.js");
    myWorker.postMessage('Mon message au worker'); // Sending message as an array to the worker
    myWorker.postMessage(['a', 'b', 'c']); // Sending message as an array to the worker
    myWorker.postMessage(['startNotifTimerWorker', windowName, 'args']); // Sending message as an array to the worker

    myWorker.onmessage = function(e) {
		const workerMessage = e.data;
        console.log('Message received from worker');
        if (workerMessage === 'sendNotif') {
            notif();
        }
	};

} else {
    console.log('Workers doesn\'t work... Too bad !');
}


function notif (){
    console.log('exec notif func');
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        //var notification = new Notification("Hi there my notif has been launched by webWorker message!");
        createNotification();
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            // var notification = new Notification("Hi there my notif has been launched by webWorker message!");
            createNotification();
        }
    });
    }
}

function createNotification() {
    var notification = new Notification("Open POC tab");
    notification.onclick = function(event) {
        event.preventDefault(); // empêche le navigateur de donner le focus à l'onglet relatif à la notification
        // window.open('http://www.mozilla.org', '_blank');
        window.focus();
    }
}