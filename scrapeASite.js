const firecrawl = require('@mendable/firecrawl-js'); // Import the module
const FirecrawlApp = firecrawl.default; // Access the default export
const dotenv = require('dotenv/config');

const app = new FirecrawlApp({ apiKey: process.env.FC_Key });


module.exports = async function scrapeASite(url) {

	const scrapeResponse = await app.scrapeUrl(url, {
		formats: ['markdown'],
	});

	if (!scrapeResponse.success) {
		throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
	}

	return scrapeResponse.markdown

}