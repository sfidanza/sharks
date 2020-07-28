import express from "express";
import MongoClient from "mongodb";
import code from "./src/code.js";
import teams from "./src/teams.js";

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	NODE_PORT
} = process.env;

const app = express();

// Serve statics if nginx is not deployed
app.use(express.static('./src/static'));

MongoClient.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`, { useUnifiedTopology: true })
	.then(client => {
		console.log("Connected to mongodb!");
		let db = client.db('test');

		app.use('/api/code', code);
		app.use('/api/teams', teams(db));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
