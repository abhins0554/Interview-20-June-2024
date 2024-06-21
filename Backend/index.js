require("dotenv").config();
require("express-async-errors");

/* Packages Import */
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('./source/utils/swagger/swagger-path')

/* Main Router Import */
const Router = require("./source/routes/router");

/* Database connection import */
const MongoDB = require("./source/databases/mongo.db");
const errorHandler = require("./source/utils/helper/errorHandler");
const { SocketMain, getIoInstance } = require("./source/socket/socket.main");

class Main {
    constructor() {
        this.app = express();
        this.routesAndMiddleware();
        this.connectToDatabase();
        this.setupSocket();
        this.listen(process.env.PORT || 5000);
    }

    routesAndMiddleware() {
        /* Adding middlewares */
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, './public/')));
        this.app.use(morgan('dev'))

        /* Added custom database health check middleware */
        this.app.use((req, res, next) => {
            if (mongoose.connection.readyState === 1) next();
            else res.status(500).json({
                message: "Database is not connected!"
            });
        });

        this.app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerFile))

        /* Adding routes */
        this.app.use("/", new Router().getRouters());

        this.app.use(errorHandler);
    }

    async connectToDatabase() {
        await MongoDB.connect();
    }

    setupSocket() {
        this.server = http.createServer(this.app);
        new SocketMain(this.server);
    }

    listen(PORT) {
        this.server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}!`);
        });
    }
}

new Main();
