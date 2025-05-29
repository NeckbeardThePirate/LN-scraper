const firecrawl = require('@mendable/firecrawl-js'); // Import the module
const FirecrawlApp = firecrawl.default; // Access the default export

const dotenv = require('dotenv/config');
const fs = require('fs');




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
    const url = `https://ln-worker.judah-ddd.workers.dev`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    console.log(await response.json())
    // return await response.json()

}

const sample = fs.readFileSync('response.md', 'utf8');
// const sumSample = makeASummary(sample)

async function streamSSE(url, text) {
    console.log('hello')
    let finalMessage = '';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    });
  
    if (!response.body) {
      console.error('ReadableStream not supported in this environment.');
      return;
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
  
      // Split buffer by newlines to process SSE lines
      let lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line for next chunk
  
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
  
          if (data === '[DONE]') {
            console.log('Stream finished');
            console.log(finalMessage)
            return;
          }
  
          // Process the chunk data (usually JSON or text)
          console.log('Received chunk:', data);
          let jsonData = await JSON.parse(data)
          console.log('...')
          console.log(jsonData.response)
          finalMessage = finalMessage + jsonData.response
          // For example, if data is JSON:
          // const parsed = JSON.parse(data);
          // update UI with parsed content
        }
      }
    }
  }
streamSSE('https://ln-worker.judah-ddd.workers.dev', sample);
  