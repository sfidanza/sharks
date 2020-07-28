/********************************************************************
 * Fabulous is a framework to create fabulous apps.
 * 
 * Fabulous is largely inspired from connect, and is developed for
 * learning purposes.
 * https://github.com/senchalabs/connect
 ********************************************************************/

/**
 * Create a new fabulous app.
 */
export class App {
	constructor() {
		this.stack = [];
		this.handler = this.handle.bind(this);
	}

	/**
	 * Plug the given middleware on incoming requests.
	 */
	use(fn) {
		if (Array.isArray(fn)) {
			this.stack.push.apply(this.stack, fn);
		} else {
			this.stack.push(fn);
		}
		return this;
	}

	/**
	 * Handle server requests, delegating them through the middleware stack.
	 */
	handle(req, res, next) {
		var stack = this.stack;
		var index = 0;
		
		// needed to simulate connect
		req.originalUrl = req.originalUrl || req.url;
		
		function nextChild() {
			var child = stack[index++];
			if (child) {
				child(req, res, nextChild);
			} else if (next) {
				next();
			}
		}
		nextChild();
	}
};
