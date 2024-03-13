const axios = require('axios');
const express = require('express');
const app = express();
const moment = require("moment-timezone");
const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:s");

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

app.get('/share', async (req, res) => {

const link = req.query.link;
const token = req.query.token;
const amount = req.query.amount;
const speed = req.query.speed;
  
if (!link || !token || !amount || !speed) {
      return res.status(400).json({ error: '🔴 Missing input!, Link, token, amount, and speed are required!!' });
    }

const shareCount = amount;
const timeInterval = speed;
const deleteAfter = 60 * 60;

let sharedCount = 0;
let timer = null;

    
async function sharePost() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/me/feed?access_token=${token}&fields=id&limit=1&published=0`,
      {
        link: link,
        privacy: { value: 'SELF' },
        no_story: true,
      },
      {
        muteHttpExceptions: true,
        headers: {
          authority: 'graph.facebook.com',
          'cache-control': 'max-age=0',
          'sec-ch-ua-mobile': '?0',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
          },
          method: 'post',
      }
    );

    sharedCount++;
    const postId = response?.data?.id;

    if (sharedCount === amount) {
      clearInterval(timer);
      console.log('Finished sharing posts.');
      
      if (postId) {
        setTimeout(() => {
          deletePost(postId);
        }, deleteAfter * 1000);
      }
    }
  } catch (error) {
    console.error(`Failed to share post because ${error.response.data}`);
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${token}`);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error.response.data);
  }
}

timer = setInterval(sharePost, timeInterval);

setTimeout(() => {
  clearInterval(timer);
  console.log('Loop stopped.');
}, shareCount * timeInterval);
res.json({ text: `Post share success here\'s some info of your shareboost: Speed of Sharing: ${speed}\n\nAmount: ${amount}\n\nFb-post-link: ${link}\n\nDate and Time of Sharing: ${time}` });
  });


app.listen(3000, () => console.log('Example app listening on port 3000!'));
 
