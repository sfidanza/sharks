import express from "express";

export default function getRouter(db) {
	const router = express.Router();

	router.get('/', function (request, response) {
		db.collection('sharks').find({}, { _id: 0 })
			.toArray()
			.then(data => {
				response.render('sharks', {
					sharks: data
				});
				// response.json({
				// 	"sharks": data
				// });
			}).catch(err => response.status(500).send(err));
	});

	router.post('/', function (request, response) {
		let { name, type } = request.body;
		let shark = { name, type };
		db.collection('sharks').insertOne(shark)
			.then(() => {
				response.redirect('/api/sharks/');
				// response.json();
			}).catch(err => {
				console.error('Unable to save shark to database: ', err);
				response.status(500).send('Unable to save shark to database');
			});
	});

	return router;
}
