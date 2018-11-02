if (window.Worker) { // Check if Browser supports the Worker api.
	console.log('Workers works');
	var myWorker = new Worker("worker_test2.js");
    myWorker.postMessage('Mon message au worker'); // Sending message as an array to the worker
    myWorker.postMessage(['a', 'b', 'c']); // Sending message as an array to the worker
    myWorker.postMessage(['startNotifWorker', 'message', 'args']); // Sending message as an array to the worker

} else {
    console.log('Workers doesn\'t work... Too bad !');
}
