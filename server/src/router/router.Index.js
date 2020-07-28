import { createReadStream } from 'fs';

export class Router {
	constructor() {
	}
	serve(request, response, ctx) {
		let view = ctx.view;
		// return starting page
		if (view === "" || view === "index.html") {
			let filename = "./src/templates/index.html";

			let fileStream = createReadStream(filename);
			fileStream.on("error", function (error) {
				response.writeHead(404, { "Content-Type": "text/plain" });
				response.end("404 Not Found");
			});
			fileStream.on("open", function () {
				response.writeHead(200, { "Content-Type": "text/html" });
				fileStream.pipe(response);
			});

			return 200;
		}
	}
}
