import { STATUS_CODES } from "http";
import { parse } from "url";

let routers = {};

export function addRouting(routePath, router) {
	routers[routePath] = router;
}

export function start(db) {
	return function onRequest(request, response, next) {
		var parsed = parse(request.url, true);
		var route = getRoute(parsed.pathname);
		var router = routers[route.base] || routers["*"];
		
		request.query = parsed.query;
		
		response.text = respondText;
		response.json = respondJson;
		response.error = respondError;
		response.req = request; // compatibility with express for sessions
		
		var status = router && router.serve(request, response, {
			view: route.view,
			db: db
		});
		if (!status) { // no matching route or view
			response.error(404);
		}
		next();
	};
}

function getRoute(path) {
	var pos = path.lastIndexOf("/");
	return {
		path: path,
		base: path.slice(0, pos + 1),
		view: path.slice(pos + 1)
	};
}

function respondText(data) {
	this.writeHead(200, { "Content-Type": "text/plain" });
	this.write(data || "");
	this.end();
}

function respondJson(data) {
	this.writeHead(200, { "Content-Type": "application/json" });
	this.write(JSON.stringify(data || {}));
	this.end();
}

function respondError(errorCode, err) {
	if (err) console.log(err);
	if (!STATUS_CODES[errorCode]) errorCode = 500;
	if (errorCode === 401) {
		this.setHeader("WWW-Authenticate", "FormBased");
	}
	this.writeHead(errorCode, { "Content-Type": "text/plain"});
	this.end(STATUS_CODES[errorCode]);
}
