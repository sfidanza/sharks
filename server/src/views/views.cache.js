import teams from "./data/teams.json";

let getData = function() {
	return {
		"teams": teams
	};
};

let views = {};

views.data = function(request, response, ctx) {
	response.json(getData());
};

views.import = function(request, response, ctx) {
	var data = getData();
	var db = ctx.db;
	
	db.collection('teams').drop(function(err, reply) {
		db.collection('teams').insertMany(data.teams, function(err, docs) {
			response.json();
		});
	});
};

export default views;
