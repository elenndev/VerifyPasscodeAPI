const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const routes = require('./routes');
var cors = require('cors')

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

let allowList = [process.env.ALLOWORIGIN]
if (process.env.ENVIRONMENT == "development"){
    allowList.push(`http://localhost:${port}`)
}
const corsOptions = {
    origin: allowList,
    optionsSuccessStatus: 200 
}

connectDB();
app.use(cors(corsOptions));
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
