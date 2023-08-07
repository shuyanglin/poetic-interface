import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const phrase = req.body.phrase || '';
  
  if (phrase.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid phrase",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(phrase),
      temperature: 0.6,
      max_tokens: 30,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(phrase) {
  return `Suggest a Poem about river Don using the Keywords. 
  Keyword: Woods
  Poem: River Don, a winding tale. Through fields and woods, it sails. Whispering secrets to the breeze, Nature's melody, at ease...
  Keyword: Stream
  Poem: River Don, a shimmering stream. In daylight's gentle gleam. Flowing through the land so free. A liquid ribbon, eternally...
  Keyword: Folk music ->
  Poem: River Don's gentle flow, inspires folk music's glow. Strings and voices, harmonize, underneath its open skies...
  Keyword: ${phrase}
  Poem: 
  `;
}
