import express from 'express';
import { MongoClient } from 'mongodb';
import sharks from "./sharks.js";

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	NODE_PORT
} = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

new MongoClient(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`)
	.connect()
	.then(dbClient => {
		console.log("Connected to mongodb!");
		const db = dbClient.db('test');

		app.use('/api/sharks', sharks(db));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
