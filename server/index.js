import { App } from "./src/lib/fabulous.js";
import { addRouting, start } from "./src/lib/server.js";
import { Router as RouterIndex } from "./src/router/router.Index.js";
import { Router as RouterViews } from "./src/router/router.Views.js";
import { Router as RouterPublic } from "./src/router/router.Public.js";
import views from "./src/views/views.js";
import viewsCache from "./src/views/views.cache.js";
import MongoClient from "mongodb";
import { createServer } from "http";

addRouting("/", new RouterIndex());
addRouting("/api/", new RouterViews(views));
addRouting("/api/cache/", new RouterViews(viewsCache));
// Serve statics if nginx is not deployed
addRouting("/static/", new RouterPublic("./src/static/"));
addRouting("/static/son/", new RouterPublic("./src/static/son/"));

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	NODE_PORT
} = process.env;
let app = new App();

MongoClient.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`, { useUnifiedTopology: true })
	.then(client => {
		console.log("Connected to mongodb!");

		app.use(start(client.db('test')));
		createServer(app.handler).listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
