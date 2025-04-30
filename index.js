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

    fs.writeFileSync('./response.json', JSON.stringify(scrapeResponse.markdown, null, 4))
    const summation = await makeASummary(scrapeResponse.markdown)
    fs.writeFileSync('./summation.json', )
	
    console.log(summation);
}

// doAScrape()


async function makeASummary(text) {
    const url = `https://gateway.ai.cloudflare.com/v1/${process.env.ENDPOINT_ID}/test-gateway/workers-ai/@cf/meta/llama-3.1-8b-instruct`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_TOKEN}`
        },
        body: JSON.stringify({
                    provider: 'workers-ai',
                    //   endpoint: "@cf/qwen/qwen1.5-7b-chat-awq",
                    //   endpoint: "@cf/meta/llama-2-7b-chat-fp16",
                    endpoint: '@cf/meta/llama-3.1-8b-instruct-fp8-fast',
                    //   endpoint: "@cf/meta/llama-2-7b-chat-fp16",
        
                    headers: {
                        Authorization: `Bearer ${myToken}`,
                        'Content-Type': 'application/json',
                    },
                    query: {
                        messages: [
                            {
                                role: 'system',
                                content: `Your job is to take each task you receive and break it into ${subItems} smaller comma separated generic subtasks, the smaller tasks should be comma delimited and there should be ${subItems}, do not do or say anything other than the returned set of comma delimited subtasks. For instance: 'Change Babys Diaper': Gather Supplies, Take off outfit, Undo diaper, Put on new diaper, Put outfit back on. They should be in the most proper and helpful order possible, when in doubt greater specificity is better`,
                            },
                            {
                                role: 'user',
                                content: `${task}`,
                            },
                        ],
                    },
            prompt: `Summarize this news story like an old school tweet: ${text}`
        })
    })
    console.log(await response.json())
    // return await response.json()

}


const sample = fs.readFileSync('response.md', 'utf8');
const sumSample = makeASummary(sample)

