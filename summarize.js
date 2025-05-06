const dotenv = require('dotenv/config');
const fs = require('fs');

module.exports = async function getSummary(article) {

	const url = 'https://ln-worker.judah-ddd.workers.dev/get-summary';

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

const article = fs.readFileSync('response.md', 'utf8');

// getSummary(article)