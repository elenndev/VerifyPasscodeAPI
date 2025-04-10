const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const routes = require('./routes');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
