const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const terminal = require('./utils/terminal');
const intervalController = require('./v1/utils/v1Interval');

dotenv.config();

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json({ charset: 'utf8', limit: '500mb' }));
app.use(express.urlencoded({ extended: true, charset: 'utf8', limit: '500mb' }));
app.use(cookieParser());

const apiRoutes = require('./v1/routes/api.route');
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, async() => {
    console.clear();
    terminal.info(`index.js | Server running on http://localhost:${port}`);
    terminal.info(`index.js | ORS_ORIGIN loaded as: ${process.env.CORS_ORIGIN}`);
    terminal.info(`index.js | NODE_ENV loaded as: ${process.env.NODE_ENV}`);
    terminal.info(`index.js | CORS_HTTP_ONLY loaded as: ${process.env.CORS_HTTP_ONLY}`);

    await intervalController.start();
    
    process.on('SIGTERM', () => {
        terminal.info('index.js | Received SIGTERM. Shutting down gracefully...');
        intervalController.stop();
        server.close(() => {
            terminal.info('index.js | Server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        terminal.info('index.js | Received SIGINT. Shutting down gracefully...');
        intervalController.stop();
        server.close(() => {
            terminal.info('index.js | Server closed');
            process.exit(0);
        });
    });
});

module.exports = { app, server };
