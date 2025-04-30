const firecrawl = require('@mendable/firecrawl-js'); // Import the module
const FirecrawlApp = firecrawl.default; // Access the default export

const dotenv = require('dotenv/config');
const fs = require('fs');

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

async function doAScrape() {
	const scrapeResponse = await app.scrapeUrl('https://notthebee.com/article/watch-president-trump-was-in-rare-form-as-he-schooled-antagonistic-abc-news-interviewer', {
		formats: ['markdown'],
	});

	if (!scrapeResponse.success) {
		throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
	}

    fs.writeFileSync('./response.json', JSON.stringify(scrapeResponse, null, 4))

	console.log(scrapeResponse);
}

doAScrape()