const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiRoutes = require(`./v1/routes/api.route`);
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = { app, server };
