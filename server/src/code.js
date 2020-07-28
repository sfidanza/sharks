import express from "express";

const CODE = 1549;

const router = express.Router()

router.get('/', function (request, response) {
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
});

export default router;
