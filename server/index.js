import express from "express";
import ejs from "ejs";
import MongoClient from "mongodb";
import code from "./src/code.js";
import teams from "./src/teams.js";
import sharks from "./src/sharks.js";

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	NODE_PORT
} = process.env;

const app = express();

// Serve statics if nginx is not deployed
app.use(express.static('./src/static'));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', 'src/views');
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

MongoClient.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`, { useUnifiedTopology: true })
	.then(client => {
		console.log("Connected to mongodb!");
		const db = client.db('test');

		app.use('/api/code', code);
		app.use('/api/teams', teams(db));
		app.use('/api/sharks', sharks(db));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
