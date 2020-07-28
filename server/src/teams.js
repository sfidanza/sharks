import express from "express";

export default function getRouter(db) {
	const router = express.Router();

	router.get('/', function (request, response) {
		db.collection('teams').find({}, { _id: 0 })
			.sort([['rank', 'asc'], ['name', 'asc']])
			.toArray()
			.then(data => {
				response.json({
					"teams": data
				});
			}).catch(err => response.status(500).send(err));
	});

	return router;
}
