// it took me 30 minutes to build this script

const axios = require('axios');

// Simulated tweet data
const tweets = [
  { content: 'Tweet 1 #covid', timestamp: new Date() },
  // Add more tweets as needed
];

// Function to simulate an anomaly by generating a burst of tweets
async function simulateAnomaly() {
  try {
    const anomalyTweets = Array.from({ length: 10 }, (_, index) => ({
      content: `Anomaly Tweet #covid ${index + 1}`,
      timestamp: new Date(),
    }));

    // Concatenate the anomaly tweets to the existing tweets
    tweets.push(...anomalyTweets);

    // Send the anomaly tweets to the specified backend system URL
    for (const tweet of anomalyTweets) {
      await axios.post('http://localhost:3000/monitor/stream', tweet);
      console.log('Tweet streamed');
    }

    console.log('Anomaly simulated');
  } catch (error) {
    console.error('Error simulating anomaly:', error.message);
  }
}

// Function to stream tweets to another backend system
async function streamTweets() {
  try {
    // Simulate streaming one tweet per second
    setInterval(() => {
      const newTweet = { content: `Tweet ${tweets.length + 1}`, timestamp: new Date() };
      tweets.push(newTweet);

      // Send the new tweet to the specified backend system URL
      axios.post('http://localhost:3000/monitor/stream', newTweet);
      console.log('Tweet streamed');
    }, 1000);

    // Simulate burst of 10 tweets every 30 seconds
    setInterval(simulateAnomaly, 10000);
  } catch (error) {
    console.error('Error streaming tweets:', error.message);
  }
}

// Start streaming tweets
streamTweets();
