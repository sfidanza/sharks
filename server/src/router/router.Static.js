import { readFileSync } from "fs";
import { Template } from "../frw/frw.Template.js";

var statics = {
	"frw.js": [
		"frw/base.js",
		"frw/frw.js",
		"frw/frw.dom.js",
		"frw/frw.ssa.js",
		"frw/frw.data.js",
		"frw/frw.history.js",
		"frw/frw.Template.js",
		"frw/uic.Dialog.js",
		"frw/uic.Tooltip.js"
	],
	"app.js": [
		"app/page.js",
		"app/page.scoreEditor.js",
		"app/page.bet.js",
		"templates/main.js",
		"templates/user.js",
		"templates/schedule.js",
		"templates/ranking.js",
		"templates/board.js",
		"templates/quickRanking.js",
		"templates/notes.js",
		"templates/bet/bet.js"
	],
	"app.css": [
		"stylesheet.css",
		"templates/bet/bet.css"
	],
	"app.tpl": {
		"main":         "main.html",
		"user":         "user.html",
		"schedule":     "schedule.html",
		"ranking":      "ranking.html",
		"board":        "board.html",
		"quickRanking": "quickRanking.html",
		"notes":        "notes.html",
		"bet":          "bet/bet.html"
	}
};

export class Router {
	constructor() {
	}
	serve(request, response, ctx) {
		var view = ctx.view;
		var files = statics[view];
		if (files) {
			var type = view.split(".")[1];
			if (type === "js") {
				response.writeHead(200, { "Content-Type": "application/javascript" });
				response.write(mergeStatics(files));
			}
			else if (type === "css") {
				response.writeHead(200, { "Content-Type": "text/css" });
				response.write(mergeStatics(files));
			}
			else if (type === "tpl") {
				response.writeHead(200, { "Content-Type": "application/xml" });
				response.write(mergeTemplates(files));
			}

			response.end();
			return 200;
		}
	}
}

function mergeStatics(files) {
	var full = [];
	for (var i = 0; i < files.length; i++) {
		full.push(readFileSync("./client/" + files[i], { encoding: "utf8" }));
	}
	return full.join("\n");
}

function mergeTemplates(files) {
	var tpl = new Template();
	tpl.create(readFileSync("./src/templates/templates.tpl", { encoding: "utf8" }));
	
	for (var id in files) {
		tpl.set('id', id);
		tpl.set('content', readFileSync("./client/templates/" + files[id], { encoding: "utf8" }));
		tpl.parseBlock('template');
	}
	tpl.parse();
	return tpl.retrieve();
}
