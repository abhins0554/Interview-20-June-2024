const mongoose = require('mongoose');

class MongoDB {
    constructor() {
        this.URL = process.env.MONGOB_URL
    }

    async connect () {
        try {
            await mongoose.connect(this.URL);
            console.log("===Database connection established===");
        } catch (error) {
            if(mongoose.connection.readyState !== 1) setTimeout(() => {
                console.log("Trying to reconnect !")
                this.connect();
            }, 15000);
        }

    }
}

module.exports = new MongoDB();