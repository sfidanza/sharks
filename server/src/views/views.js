let views = {};

const CODE = 1549;

views.teams = function(request, response, ctx) {
	ctx.db.collection('teams').find({}, { _id: 0 })
		.sort([['rank', 'asc'], ['name', 'asc']])
		.toArray()
		.then(data => {
			response.json({
				"teams": data
			});
		}).catch(response.error.bind(response, 500));
};

views.code = function(request, response, ctx) {
	let guess = +request.query.guess;
	if (guess === CODE) {
		response.json({
			"success": true
		});
	} else {
		response.json({
			"error": true
		});
	}
//	response.error(404, "Je ne trouve pas...");
};

export default views;
