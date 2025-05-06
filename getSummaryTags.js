module.exports = async function getSummaryTags(summary) {

	const url = 'https://ln-worker.judah-ddd.workers.dev/get-tags';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			summary: `${summary}`
		})

	});

	const returnable = await response.json();
	console.log(returnable.storyTags.response)
	return returnable.storyTags.response
}

// const article = fs.readFileSync('response.md', 'utf8');

// getSummary(article)