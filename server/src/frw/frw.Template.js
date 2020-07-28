/**********************************************************
 * Template Engine
 *
 * regexp hints:
 *   \w is the "word" character class [A-Za-z0-9_]
 *   (?: starts a non-capturing expression
 *   (?= starts a positive lookahead expression
 * More about regular expressions: http://www.regular-expressions.info
 **********************************************************/

/**
 * Remove blank space on right and left side of the string
 */
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}

/**
 * supplant is used by the template engine
 */
String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return (r !== undefined) ? r : a;
		}
	);
};

export class Template {
	MAIN = "_main";

	constructor() {
		this.data = {}; // stores data to supplant in templates

		//	this.mode = 'default'; // 'default' supports blocks inside blocks, but create is longer
		this.mode = 'noSubBlock'; // 'noSubBlock' triggers simpler parsing (faster create)
		this.defExpr = /(?:<!-- BEGIN: ([-\w]+) -->)?([\s\S]*?)(?:<!-- END: ([-\w]+) -->|(?=<!-- BEGIN: [-\w]+ -->))/g;
		this.nsbExpr = /<!-- BEGIN: ([-\w]+) -->([\s\S]*?)<!-- END: ([-\w]+) -->/g;
	}
    /**
     * Initialize the template object with the source text
     *  this calls the onCreate callback, passing it any additional parameter
     */
	create(tplText) {
		var params = Array.prototype.slice.call(arguments, 1);
		this.onCreate.apply(this, params);
		this.make(tplText.trim());
		return this;
	}
	store(s, child) {
		var current;
		if (this.stack.length > 0) {
			current = this.stack[this.stack.length - 1];
			this.blocks[current] += s;
			s = "";
		}
		else {
			current = this.MAIN;
		}
		if (child) {
			this.subBlocks[current].push(child);
		}
		return s;
	}
	make(text) {
		var self = this;
		var expr = (this.mode == 'noSubBlock') ? this.nsbExpr : this.defExpr;

		this.blocks = {};
		this.subBlocks = {};
		this.parsedBlocks = {};
		this.stack = [];

		this.subBlocks[this.MAIN] = [];
		this.parsedBlocks[this.MAIN] = [];
		this.blocks[this.MAIN] = text.replace(expr, function (a, b, c, d) {
			if (b) { // BEGIN
				self.stack.push(b);
				self.blocks[b] = "";
				self.subBlocks[b] = [];
				self.parsedBlocks[b] = [];
				self.set("blk_" + b, "");
			}

			var r = self.store(c);

			if (d) { // END
				var closed = self.stack.pop(); // closed === d
				r = self.store("{blk_" + closed + "}", closed);
			}
			return r;
		});
	}
    /**
     * Set a template variable to a value
     *  if value is an object, all its properties are placed into key_property
     */
	set(key, value) {
		if (typeof value === 'object') {
			for (var p in value) {
				this.setValue(key + '.' + p, value[p]);
			}
		}
		else {
			this.setValue(key, value);
		}
	}
	setValue(key, value) {
		this.data[key] = (value != null) ? value : "";
	}
	get(key) {
		return this.data[key] || '';
	}
    /**
     * Retrieve the parsed content
     *  An optional block id can be passed to target a specific block
     *  The targeted block content is reset
     */
	retrieve(blkId) {
		blkId = blkId || this.MAIN;
		var str = this.parsedBlocks[blkId].join('');
		this.parsedBlocks[blkId] = [];
		return str;
	}
    /**
     * Parse the specified block
     *  Blocks allow conditional and multiple parsing of content
     */
	parseBlock(blkId) {
		//	var blk = this.blocks[blkId];
		//	if (!blk) return null;
		var children = this.subBlocks[blkId];
		if (!children)
			return null;
		for (var i = 0; i < children.length; i++) {
			this.set("blk_" + children[i], this.retrieve(children[i]));
		}
		var str = this.blocks[blkId].supplant(this.data);
		this.parsedBlocks[blkId].push(str);
	}
    /**
     * Parse the template
     *  Pass any argument to the OnParse callback, that should prepare the data
     *  (using 'set' and 'parseBlock')
     */
	parse() {
		this.onParse.apply(this, arguments);
		this.parseBlock(this.MAIN);
	}
	onCreate() {
		// to be overridden
	}
	onParse(pfx, obj) {
		// to be overridden
		this.set(pfx, obj);
	}
}
