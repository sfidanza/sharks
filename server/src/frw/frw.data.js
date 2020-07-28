/**********************************************************
 * Data Management layer
 **********************************************************/

let data = {};

/**
 * Filter the list by a given property
 */
data.filter = function(list, property, value) {
	var filteredList = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if (item[property] == value) {
			filteredList.push(item);
		}
	}
	return filteredList;
};

/**
 * Group the list by a given property
 */
data.groupBy = function(list, property, sorted) {
	var groupedList = {};
	var values = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var value = (typeof property == "function") ? property(item) : item[property];
		if (value == null) continue;
		if (!groupedList[value]) {
			values.push(value);
			groupedList[value] = [];
		}
		groupedList[value].push(item);
	}
	
	if (sorted) {
		var sortedGroupedList = {};
		values.sort();
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			sortedGroupedList[value] = groupedList[value];
		}
		groupedList = sortedGroupedList;
	}
	
	return groupedList;
};

/**
 * Change a list to an object, indexed by a given property
 */
data.reIndex = function(list, key) {
	if (!list) return null;
	var indexedList = {};
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var newKey = (typeof key == "function") ? key(item) : item[key];
		indexedList[newKey] = item;
	}
	return indexedList;
};

/**
 * Sort an array of objects on the specified properties
 * @param {object[]} list  the list of object to sort
 * @param {array} sorters  the sorting criterias as an array of object:
 *           {string} key  the property to sort on
 *           {number} dir  the sort direction: ascending (1, default) or descending (-1)
 */
data.sort = function(list, sorters) {
	if (!list.length) return list;
	
	// no bind as bind is killing performance
	list.sort(function(a, b) {
		return _sortMultipleKeys(sorters, a, b);
	});
	return list;
};

var _sortMultipleKeys = function(sorters, a, b) {
	if (!sorters || !sorters.length) return 0;
	
	for (var i = 0, len = sorters.length; i < len; i++) {
		var sorter = sorters[i];
		var va = a[sorter.key];
		var vb = b[sorter.key];
		if (va !== vb) {
			return (va < vb) ? -sorter.dir : sorter.dir;
		}
	}
	return 0;
};

/**
 * Create a filtering function from a string expression
 * @param {string} expr
 */
data.getFilter = function(expr) {
	expr = expr.replace(/\$/g, "element");
	var f = null;
	try {
		f = new Function("element", "return " + expr);
	} catch(ex_eval) {
		f = function(element) { return true; };
		console.error('[getFilter] could not execute expression: "' + expr + '"\nException: ' + ex_eval);
	}
	return f;
};

/**
 * Evaluate a given javascript expression on the list and return matching rows.
 * The row object should be denoted by $ (eg. "$.price").
 * @param {object[]}  list  list of data to filter
 * @param {string}    expr  javascript expression, eg. '$.price<=200 && $.distance<10' (optional)
 * @return object[]
 */
data.query = function(list, expr) {
	var results, filter;
	if ((typeof expr === 'string') && (expr !== '')) { // Generic expression evaluation filter
		filter = this.getFilter(expr);
	}

	if (filter) {
		results = [];
		for (var i = 0, len = list.length; i < len; i++) {
			if (filter(list[i])) {
				results.push(list[i]);
			}
		}
	} else { // no filter
		results = list.slice(0); // make sure we return a copy
	}
	return results;
};

export default data;
