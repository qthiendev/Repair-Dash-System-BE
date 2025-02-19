const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(express.json());

const apiRoutes = require(`./routes/api.route`);
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = { app, server };
