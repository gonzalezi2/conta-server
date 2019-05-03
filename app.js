// We’ll declare all our dependencies here
const 	express = require('express'),
		path = require('path'),
		bodyParser = require('body-parser'),
		cors = require('cors'),
		mongoose = require('mongoose'),
		companies = require('./controllers/companies'),
		projects = require('./controllers/projects'),
		employees = require('./controllers/employees');


require('dotenv').config();

//Connect mongoose to our database
const databaseUrl = process.env.DATABASEURL;
//Declaring Port
const port = process.env.PORT;

mongoose.connect(databaseUrl, {useMongoClient: true});
mongoose.connection.on('connected', () => {
	console.log(`Database connected: ${databaseUrl}`);
});
mongoose.connection.on('error', (err) => {
	console.log(`Database error: ${err}`);
})

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());
app.use(express.static(__dirname + '/dist/'));

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Routing all HTTP requests to the appropriate controller
app.use('/api/companies', companies);
app.use('/api/companies/:id/projects', projects);
app.use('/api/employees', employees);

// app.get('/', (req, res) => {
//     res.send("Invalid Endpoint");
// });

// Serves the angular application instead of going to the server
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

//Listen to port
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});