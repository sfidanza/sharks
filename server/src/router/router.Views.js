export class Router {
	constructor(controller) {
		this.views = controller;
	}
	serve(request, response, ctx) {
		var method = this.views && this.views[ctx.view];
		if (typeof method === 'function') {
			method(request, response, ctx);
			return 200;
		}
	}
}
