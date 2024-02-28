const axios = require('axios');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('endpoints: /share?accessToken=your access token&shareUrl=urfbposturl&shareAmount=shareamount');
});

app.get('/tools/darkai', (req, res) => {
  const question = req.query.question;
  if (!question) {
      return res.status(400).json({ error: 'Question Is Required, Use question=' });
  }
      let answer = '';

    // Custom responses for specific queries
    if (question.includes('who are you?')) {
      answer = "I'm a Automated Bot was make on http://45.90.13.219:6765 Autobot, pls follow https://www.facebook.com/berlovesyou for more updates on autobot";
    } else if (question.includes('who created you?')) {
      answer = "I was created by Ainz.";
    } else if (question.includes('who created you')) {
      answer = "I was created by Ainz.";
    } else if (question.includes('what is your model?')) {
      answer = "my model is gpt3.5 turbo";
    } else if (question.includes('what is your model?')) {
      answer = "my model is gpt3.5 turbo";
    } else if (question.includes('what is your model')) {
      answer = "my model is gpt3.5 turbo";
    } else if (question.includes('who are you')) {
      answer = "I'm a Automated Bot, Nice to meet you!";
    }

    if (answer !== '') {
      res.json({ message: answer });
      return;
    }
  const url = 'https://useblackbox.io/chat-request-v4';
  const data = {
    textInput: question,
    allMessages: [{user: question}],
    stream: '',
    clickedContinue: false,
  };
  axios.post(url, data)
    .then(response => {
      const message = response.data.response[0][0];
      res.json({ message });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred.' });
    });
});

app.get('/share', async (req, res) => {

const accessToken = req.query.accessToken;
const shareUrl = req.query.shareUrl;
const shareAmount = req.query.shareAmount;
  
if (!accessToken || !shareUrl || !shareAmount) {
      return res.status(400).json({ error: 'Token,URL, and Amount are required' });
    }

const shareCount = shareAmount;
const timeInterval = 1500;
const deleteAfter = 60 * 60;

let sharedCount = 0;
let timer = null;

async function sharePost() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
      {
        link: shareUrl,
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

    console.log(`Access token: ${accessToken}`);
    console.log(`Post shared: ${sharedCount}`);
    console.log(`Post ID: ${postId || 'Unknown'}`);

    if (sharedCount === shareAmount) {
      clearInterval(timer);
      console.log('Finished sharing posts.');

      if (postId) {
        setTimeout(() => {
          deletePost(postId);
        }, deleteAfter * 1000);
      }
    }
  } catch (error) {
    console.error('Failed to share post:', error.response.data);
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
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
res.json({ message: 'Sharing process started' });
  });


app.listen(3000, () => console.log('Example app listening on port 3000!'));
