// const dotenv = require('dotenv/config');
// const fs = require('fs');

module.exports = async function rankStories(summaries) {

	const url = 'https://ln-worker.judah-ddd.workers.dev//validate-captcha-token';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			stories: `${summaries}`
		})

	});

	const returnable = await response.json();
	console.log(returnable)
	return returnable.orderedStories.response
}

// const article = fs.readFileSync('response.md', 'utf8');

// getSummary(article)