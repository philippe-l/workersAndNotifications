onmessage = function(e) {
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
                console.log('message sent from worker');
                postMessage("sendNotif");
            }, 5000);
            console.log(intervalID);
        }
    } else {
        console.log('n\'est pas un array');
        console.log(e);
    }
}