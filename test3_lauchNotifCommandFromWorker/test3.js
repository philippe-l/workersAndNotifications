if (window.Worker) { // Check if Browser supports the Worker api.
	console.log('Workers works');
	var myWorker = new Worker("worker_test3.js");
    myWorker.postMessage('Mon message au worker'); // Sending message as an array to the worker
    myWorker.postMessage(['a', 'b', 'c']); // Sending message as an array to the worker
    myWorker.postMessage(['startNotifTimerWorker', 'message', 'args']); // Sending message as an array to the worker

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
        var notification = new Notification("Hi there my notif has been launched by webWorker message!");
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification("Hi there my notif has been launched by webWorker message!");
        }
    });
    }
}