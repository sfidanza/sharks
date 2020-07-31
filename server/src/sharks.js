import express from "express";

export default function getRouter(db) {
	const router = express.Router();

	router.get('/', function (request, response) {
		db.collection('sharks').find({})
			.toArray()
			.then(data => {
				response.json({
					"sharks": data
				});
			}).catch(err => {
				console.error(err);
				response.status(500).json({ error: 'Unable to get sharks from database: ' + err.errmsg });
			});
	});

	router.post('/', function (request, response) {
		let { name, type } = request.body;
		let shark = { _id: name, name, type };
		db.collection('sharks').insertOne(shark)
			.then(result => {
				let { insertedCount, insertedId } = result;
				response.json({ insertedCount, insertedId });
			}).catch(err => {
				console.error(err);
				response.status(500).json({ error: 'Unable to save shark to database: ' + err.errmsg });
			});
	});

	router.put('/:id', function (request, response) {
		const id = request.params.id
		let { type } = request.body;
		let sharkUpd = { type };
		db.collection('sharks').updateOne({ _id: id }, { $set: sharkUpd })
			.then(result => {
				let { modifiedCount, upsertedCount, upsertedId } = result;
				response.json({ modifiedCount, upsertedCount, upsertedId });
			}).catch(err => {
				console.error(err);
				response.status(500).json({ error: 'Unable to update shark in database: ' + err.errmsg });
			});
	});

	router.delete('/:id', function (request, response) {
		const id = request.params.id
		db.collection('sharks').deleteOne({ _id: id })
			.then(result => {
				response.status(result.deletedCount ? 202 : 404).json({ success: true });
			}).catch(err => {
				console.error(err);
				response.status(500).json({ error: 'Unable to delete shark from database: ' + err.errmsg });
			});
	});

	return router;
}
