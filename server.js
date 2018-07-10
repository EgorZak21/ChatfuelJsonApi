const config = require('./config');
const GoogleAPI = new (require('./googleAPI'))(config.google_token);
const DBClient = new (require('./DBClient'))(config.dbloc, GoogleAPI);
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
require('./app')(app,DBClient);
DBClient.connect().then(()=>{
    app.listen(config.port, ()=>{
        console.log('Server is running on port '+config.port);
    });
});