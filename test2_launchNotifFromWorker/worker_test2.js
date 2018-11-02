onmessage = function(e) {
    console.log('Message received from main script');
    if (Array.isArray(e.data)) {
        console.log('est un array');
        e.data.forEach(el => {
            console.log(el);
        });
        if (e.data[0] === 'startNotifWorker') {
            console.log(self);

            var intervalID = self.setInterval(()=> {
                this.notif();
            }, 5000);
            console.log(intervalID);
        }
    } else {
        console.log('n\'est pas un array');
        console.log(e);
    }
}

function notif (){
    console.log('exec notif func');
    if (!("Notification" in self)) {
        alert("This browser does not support desktop notification");
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("Hi there!");
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification("Hi there!");
        }
    });
    }
}