require('dotenv').config();
require('express-async-errors');
const authRouter = require('./routes/auth');
// extra security packages
const cors = require('cors');
const axios = require('axios');

const authenticator = require("./middleware/authentication");
const express = require('express');
const app = express();
// connectDB
const connectDB = require('./db/connect');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('FSD 5');
});

app.use('/api/auth', authRouter);

// YouTube Search Helper
async function searchYouTube(keywords) {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      maxResults: 5,
      q: keywords.join(' '),
      key: process.env.YOUTUBE_API_KEY,
      type: 'video',
      relevanceLanguage: 'en'
    }
  });
  return response.data.items.map(item => ({
    title: item.snippet.title,
    url: `https://youtube.com/watch?v=${item.id.videoId}`,
    channel: item.snippet.channelTitle
  }));
}

async function searchArticles(keywords) {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        q: keywords.join(' '),
        cx: process.env.GOOGLE_CSE_ID,
        key: process.env.GOOGLE_API_KEY,
        num: 5,
        siteSearch: '*.edu',
        siteSearchFilter: 'i',
        dateRestrict: 'm6' // Last 6 months
      }
    });

    console.log('Full API Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.items?.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet
    })) || [];
    
  } catch (error) {
    console.error('CSE Error Details:', error.response?.data || error.message);
    return [];
  }
}

// Main API Endpoint
app.get('/search', async (req, res) => {
  try {
    console.log("hii")
    const keywords = req.query.keywords.split(',');
    console.log(keywords)
    // const [ articles] = await Promise.all([
    const [videos, articles] = await Promise.all([
      searchYouTube(keywords),
      searchArticles(keywords)
    ]);
    console.log(videos)
    console.log(articles)

    
    res.json({articles , videos});
    
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
