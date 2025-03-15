const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');
const axios = require('axios');
const { getRandomQuote } = require('./app'); // Import the function from app.js
const cron = require('node-cron')
dotenv.config();

// Load API credentials from .env
const x_api_key = process.env.X_API_KEY;
const x_secret = process.env.X_API_KEY_SECRET;
const x_access_token = process.env.X_ACCESS_TOKEN;
const x_access_secret = process.env.X_ACCESS_SECRET;

// Initialize Twitter client
const client = new TwitterApi({
    appKey: x_api_key, 
    appSecret: x_secret,
    accessToken: x_access_token,
    accessSecret: x_access_secret
});

// Function to post a tweet
async function postTweet() {
    try {
        const quote = await getRandomQuote();
        if (!quote) {
            console.error('No quote received');
            return;
        }
        const tweet = await client.v2.tweet(quote);
        console.log('Tweet posted:', tweet);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}


cron.schedule('0,6,12,18,23', ()=>{
    postTweet();
})
// Run the bot
