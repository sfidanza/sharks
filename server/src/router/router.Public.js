import { createReadStream } from 'fs';

var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"gif": "image/gif",
	"ico": "image/x-icon",
	"js": "text/javascript",
	"css": "text/css",
	"mp3": "audio/mpeg"
};

export class Router {
	constructor(basePath) {
		this.basePath = basePath;
	}
	serve(request, response, ctx) {
		let view = ctx.view || "index.html";
		let filename = this.basePath + view;

		let fileStream = createReadStream(filename);
		fileStream.on("error", function (error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end("404 Not Found");
		});
		fileStream.on("open", function () {
			let mimeType = mimeTypes[view.split(".")[1]];
			response.writeHead(200, { "Content-Type": mimeType });
			fileStream.pipe(response);
		});

		return 200;
	}
}
