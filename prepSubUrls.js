const scrapeASite = require('./scrapeASite.js');
const fs = require('fs');
const extractStories = require('./extractStories.js')
const summarize = require('./summarize.js')
const rankStories = require('./rankStories.js');
const getSummaryTags = require('./getSummaryTags.js');

module.exports = async function prepSubUrls(){

	const daySubUrls = []
	const mainUrls = await JSON.parse(fs.readFileSync('./data/MainUrls.json', 'utf8'));
	const urlMatchList = await JSON.parse(fs.readFileSync('./data/UrlPatterns.json', 'utf8'))
	const mdResponseCount = await JSON.parse(fs.readFileSync('./data/mdResponseCount.json', 'utf8'))
	let currentIter = mdResponseCount.mdResponseCount + 1
	const todaysSummaries = [];

	for (url in mainUrls) {

		const siteMd = await scrapeASite(mainUrls[url])
		const storyUrls = extractStories(siteMd, urlMatchList[mainUrls[url]])
		storyUrls.forEach((subUrl) => {
			daySubUrls.push(subUrl)			
		})
	}

	fs.writeFileSync('./data/daySubUrls.json', JSON.stringify(daySubUrls, null, 4));


	for (const url in daySubUrls) {
		const storyMd = await scrapeASite(daySubUrls[url])
		fs.writeFileSync(`./data/mdResponses/md${String(currentIter)}.md`, storyMd);
		currentIter++
		fs.writeFileSync('./data/mdResponseCount.json', JSON.stringify({ "mdResponseCount": currentIter }))
		const storySummary = await summarize(storyMd)
		if (storySummary.length > 200) {
			console.log('overly long summary')
		}
		todaysSummaries.push(storySummary);
	}
	const todaysSummariesTags = await JSON.parse(fs.readFileSync('./data/todaysSummaries.json', "utf8"))

	todaysSummariesTags.general = todaysSummaries;

	fs.writeFileSync('./data/todaysSummaries.json', JSON.stringify(todaysSummariesTags, null, 4))

	for (const summary in todaysSummaries) {
		const storyTags = await getSummaryTags(todaysSummaries[summary])
		const storyTagsArr = storyTags.split(',');
		for (const tag in storyTagsArr) {

			if (todaysSummariesTags[storyTagsArr[tag]]) {
				todaysSummariesTags[storyTagsArr[tag]].push(todaysSummaries[summary]);
			}
		}
	}

	
	for (cat in todaysSummariesTags) {
		if (todaysSummariesTags[cat].length > 5) {
			const rankedStories = await rankStories(todaysSummariesTags[cat])
			const rankedStoriesArr = rankedStories.split('&&');
			todaysSummariesTags[cat] = rankedStoriesArr;
		}
	}
	fs.writeFileSync('./data/todaysSummaries.json', JSON.stringify(todaysSummariesTags, null, 4))
}


// [
// 	"https://notthebee.com",
// 	"https://ground.news",
// 	"https://ft.com",
// 	"https://www.espn.com/",
// 	"https://arstechnica.com/"

// ]