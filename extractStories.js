module.exports = function extractStories(markdown, startsWith) {
	// const markdown = fs.readFileSync(filePath, 'utf8');

	const urlRegex = /https?:\/\/[^\s)]+/g;

	const uniqueUrls = {}

	const allUrls = markdown.match(urlRegex) || [];
	
	// Filter by prefix
	const matchingUrls = allUrls.filter(url => url.startsWith(startsWith));
	matchingUrls.forEach((url) => {
		uniqueUrls[url] = url
	})
	const URLArr = [];
	for (const url in uniqueUrls) {
		URLArr.push(url)
	}
	return URLArr;
}

// const myList = extractUrlsFromMarkdown(`./response${executionNum}.md`, 'https://notthebee.com/article/')
