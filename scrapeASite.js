const firecrawl = require('@mendable/firecrawl-js');
const FirecrawlApp = firecrawl.default;
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