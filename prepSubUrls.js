// import scrapeASite from './scrapeASite.js';
// import fs from 'fs';
// import extractStories from './extractStories.js';
// import summarize from './summarize.js';
// import rankStories from './rankStories.js';
// import getSummaryTags from './getSummaryTags.js';
// import extractArticleInfo from './condenseInfo.js';

const scrapeASite = require('./scrapeASite.js');
const fs = require('fs');
const extractStories = require('./extractStories.js')
const summarize = require('./summarize.js')
const rankStories = require('./rankStories.js');
const getSummaryTags = require('./getSummaryTags.js');
const extractArticleInfo = require('./condenseInfo.js');

// export default async function prepSubUrls(){
module.exports = prepSubUrls
async function prepSubUrls() {
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
		if (url > 2) {
			continue
			console.log('hello')
		}
		console.log(url)
		console.log(`executing on ${daySubUrls[url]}`)
		const storyMd = await scrapeASite(daySubUrls[url])
		fs.writeFileSync(`./data/mdResponses/md${String(currentIter)}.md`, storyMd);
		currentIter++
		fs.writeFileSync('./data/mdResponseCount.json', JSON.stringify({ "mdResponseCount": currentIter }))
		console.log(typeof storyMd)
		const compressedStory = extractArticleInfo(storyMd)
		fs.writeFileSync(`./data/mdParsedResponses/md${String(currentIter)}.md`, JSON.stringify(compressedStory, null, 4));
		console.log(compressedStory)
		console.log(typeof compressedStory)
		const storySummary = await summarize(JSON.stringify(compressedStory))
		if (storySummary.length > 200) {
			console.log('overly long summary')
		}
		todaysSummaries.push(storySummary);
	}
	const todaysSummariesTags = await JSON.parse(fs.readFileSync('./data/todaysSummaries.json', "utf8"))
	console.log(todaysSummaries)
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

async function test1() {
	const daySubUrls = [
		"https://ground.news/article/labor-wins-australia-election-broadcasters-abc-sky-news-australia-say",
		"https://ground.news/article/s-and-p-500-posts-longest-winning-streak-in-20-years-as-trump-and-china-show-some-willingness-to-bend-on-trade"
	]
	let currentIter = 120
	for (const url in daySubUrls) {
		const storyMd = await scrapeASite(daySubUrls[url])
		fs.writeFileSync(`./data/mdResponses/md${String(currentIter)}.md`, storyMd);
		currentIter++
		const parsedMD = extractArticleInfo(storyMd)
		fs.writeFileSync(`./data/mdParsedResponses/md${String(currentIter)}.md`, JSON.stringify(parsedMD));

		// const storySummary = await summarize(storyMd)
		// if (storySummary.length > 200) {
		// console.log('overly long summary')
		// }
		// todaysSummaries.push(storySummary);
	}
}

// test1()
prepSubUrls()