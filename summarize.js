module.exports = async function getSummary(article) {

	const url = 'https://ln-worker.lightlabs.workers.dev/get-summary';

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			article: article
		})

	});
	// need to utilize a /n/n check to remove incorrect replies
	const returnable = await response.json();
	return returnable.summary.response
}