const firecrawl = require('@mendable/firecrawl-js'); // Import the module
const FirecrawlApp = firecrawl.default; // Access the default export
const summarize = require('./summarize.js')
const dotenv = require('dotenv/config');
const fs = require('fs');
const rankStories = require('./rankStories.js')
const prepSubUrls = require('./prepSubUrls.js')
// const app = new FirecrawlApp({ apiKey: "fc-YOUR_API_KEY" });

// // Scrape a website:
// (async () => {
//   try {
//     const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] });

//     if (!scrapeResult.success) {
//       throw new Error(`Failed to scrape: ${scrapeResult.error}`);
//     }

//     console.log(scrapeResult);
//   } catch (error) {
//     console.error(error);
//   }
// })();





const app = new FirecrawlApp({ apiKey: process.env.FC_Key });

async function doAScrape(url, executionNum) {
	const scrapeResponse = await app.scrapeUrl(url, {
		formats: ['markdown'],
	});

	if (!scrapeResponse.success) {
		throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
	}
    fs.writeFileSync(`./response${String(executionNum)}.md`, JSON.stringify(scrapeResponse.markdown, null, 4))
    // const summation = await makeASummary(scrapeResponse.markdown)
    // fs.writeFileSync('./summation.json', )
	
    // console.log(summation); 
}
// const scrapeUrl = 'https://notthebee.com/article/watch-president-trump-was-in-rare-form-as-he-schooled-antagonistic-abc-news-interviewer'
// const scrapeUrl = 'https://ground.news/' 
const scrapeUrl = 'https://notthebee.com/'

const executionNum = 22;

// doAScrape(scrapeUrl, executionNum)

const sample = fs.readFileSync('response.md', 'utf8');

const urlsToScrape = [
	"https://ground.news/article/labor-wins-australia-election-broadcasters-abc-sky-news-australia-say",
	"https://ground.news/article/nypd-shared-a-palestinian-protesters-info-with-ice-now-its-evidence-in-her-deportation-case",
	"https://ground.news/article/nypd-shared-a-palestinian-protesters-info-with-ice-now-its-evidence-in-her-deportation-case",
	"https://ground.news/article/trump-department-of-justice-sues-colorado-denver-officials-over-immigration-laws",
	"https://ground.news/article/scientific-societies-say-theyll-step-up-after-trump-puts-key-climate-report-in-doubt",
	"https://ground.news/article/voters-to-decide-if-the-texas-home-of-elon-musks-spacex-should-become-an-official-city-starbase_60c091",
	"https://ground.news/article/us-state-department-approves-sale-of-f-16-spare-parts-to-ukraine",
	"https://ground.news/article/devastating-quad-cities-organizations-scramble-after-americorps-cuts"
];
async function getSubStories(urlsToScrape, currentIteration) {
    const responsesToProcess = [];
    for (const url in urlsToScrape) {
        console.log(urlsToScrape[url])
        await doAScrape(urlsToScrape[url], currentIteration)
        console.log(String(currentIteration))
        responsesToProcess.push(String(currentIteration))
        currentIteration++
    }
    for (const num in responsesToProcess) {
        const articleInfo = fs.readFileSync(`./response${responsesToProcess[num]}.md`, 'utf8')
        const newSummary = await summarize(articleInfo)
        const summaries = await JSON.parse(fs.readFileSync(`./summaries.json`, 'utf8'));

        summaries.push(newSummary)

        fs.writeFileSync(`./summaries.json`, JSON.stringify(summaries, null, 4))

    }
}

// getSubStories(urlsToScrape, executionNum)

async function getRankedStories() {
    const summaries = fs.readFileSync(`./summaries.json`, 'utf8')

    const finalRanking = await rankStories(summaries);
    const finalRankingArr = finalRanking.split('&&')
    console.log(finalRankingArr)
}

prepSubUrls()