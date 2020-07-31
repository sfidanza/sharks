import express from "express";

export default function getRouter(db) {
	const router = express.Router();

	router.get('/', function (request, response) {
		db.collection('sharks').find({})
			.toArray()
			.then(data => {
				response.render('sharks', {
					sharks: data
				});
				// response.json({
				// 	"sharks": data
				// });
			}).catch(err => response.status(500).json({ error: err }));
	});

	router.post('/', function (request, response) {
		let { name, type } = request.body;
		let shark = { _id: name, name, type };
		db.collection('sharks').insertOne(shark)
			.then(() => {
				response.redirect('/api/sharks/');
				// response.json();
			}).catch(err => {
				console.error('Unable to save shark to database: ', err);
				response.status(500).json({ error: 'Unable to save shark to database' });
			});
	});

	router.delete('/:id', function (request, response) {
		const id = request.params.id
		db.collection('sharks').deleteOne({ _id: id })
			.then(result => {
				response.status(result.deletedCount ? 202 : 404).json({ success: true });
			}).catch(err => {
				console.error('Unable to delete shark from database: ', err);
				response.status(500).json({ error: 'Unable to delete shark from database' });
			});
	});

	return router;
}
