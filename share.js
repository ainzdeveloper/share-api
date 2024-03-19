const axios = require('axios');
const express = require('express');
const port = 3000;
const app = express();
const moment = require("moment-timezone");
const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:s");

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

app.post('/share', async (req, res) => {

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

    try {
      const a = await axios.get(`https://graph.facebook.com/me?access_token=${token}`);
      if (a.data.error) {
        return res.status(401).json({ error: 'Invalid access token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
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


const addedLinks = [
"https://vt.tiktok.com/ZSFPnnywU/",
        "https://vt.tiktok.com/ZSFPWRm3q/",
        "https://vt.tiktok.com/ZSFPW14t4/",
        "https://vt.tiktok.com/ZSFPWFWAC/",
        "https://vt.tiktok.com/ZSFPngg1K/",
        "https://vt.tiktok.com/ZSFPngro4/",
        "https://vt.tiktok.com/ZSFPW13wB/",
        "https://vt.tiktok.com/ZSFPnvf3J/",
        "https://vt.tiktok.com/ZSFPWLQjF/",
        "https://vt.tiktok.com/ZSFPW8FTy/",
        "https://vt.tiktok.com/ZSFPWNLT2/",
        "https://vt.tiktok.com/ZSFPnpxyq/",
        "https://vt.tiktok.com/ZSFPncoC5/",
        "https://vt.tiktok.com/ZSFPnnpTD/",
        "https://vt.tiktok.com/ZSFPnsdpK/",
        "https://vt.tiktok.com/ZSFPnKno6/",
        "https://vt.tiktok.com/ZSFPWNu53/",
        "https://vt.tiktok.com/ZSFPW8VLF/",
        "https://vt.tiktok.com/ZSFPWeArb/",
        "https://vt.tiktok.com/ZSFPWR6Lx/",
        "https://vt.tiktok.com/ZSFPWRgmJ/",
        "https://vt.tiktok.com/ZSFPnoQdb/",
        "https://vt.tiktok.com/ZSFPncbCP/",
        "https://vt.tiktok.com/ZSFPWFCt7/",
        "https://vt.tiktok.com/ZSFPW8khF/",
        "https://vt.tiktok.com/ZSFPWYrfo/",
        "https://vt.tiktok.com/ZSFPnTnv2/",
        "https://vt.tiktok.com/ZSFPnvuhh/",
        "https://vt.tiktok.com/ZSFPWJHvh/",
        "https://vt.tiktok.com/ZSFPWJDBb/",
        "https://vt.tiktok.com/ZSFPnGUYv/",
        "https://vt.tiktok.com/ZSFPnWVh3/",
        "https://vt.tiktok.com/ZSFPnvS45/",
        "https://vt.tiktok.com/ZSFPWdgWJ/",
        "https://vt.tiktok.com/ZSFPWJdJx/",
        "https://vt.tiktok.com/ZSFPnnkVB/",
        "https://vt.tiktok.com/ZSFPnvgw6/",
        "https://vt.tiktok.com/ZSFPnntdW/",
        "https://vt.tiktok.com/ZSFPnvDJ4/",
        "https://vt.tiktok.com/ZSFPnnTHG/",
        "https://vt.tiktok.com/ZSFPnvTgv/",
        "https://vt.tiktok.com/ZSFPntC9m/",
        "https://vt.tiktok.com/ZSFPW12m4/",
        "https://vt.tiktok.com/ZSFPnEn8Y/",
        "https://vt.tiktok.com/ZSFPn7E27/",
        "https://vt.tiktok.com/ZSFPWdgqA/",
        "https://vt.tiktok.com/ZSFPn3F8C/",
        "https://vt.tiktok.com/ZSFPWekL2/",
        "https://vt.tiktok.com/ZSFPW19xj/",
        "https://vt.tiktok.com/ZSFPWJVu4/",
        "https://vt.tiktok.com/ZSFPWdMpP/",
        "https://vt.tiktok.com/ZSFPWMM8P/",
        "https://vt.tiktok.com/ZSFPWmjcm/",
        "https://vt.tiktok.com/ZSFPWBtrv/",
        "https://vt.tiktok.com/ZSFPWarR4/",
        "https://vt.tiktok.com/ZSFPWYWXs/",
        "https://vt.tiktok.com/ZSFPWjyXe/",
        "https://vt.tiktok.com/ZSFPWUK9a/",
        "https://vt.tiktok.com/ZSFPWf4YF/",
        "https://vt.tiktok.com/ZSFPWQTXt/",
        "https://vt.tiktok.com/ZSFPWPWSp/",
        "https://vt.tiktok.com/ZSFPWfjsk/",
        "https://vt.tiktok.com/ZSFPWSWTX/",
        "https://vt.tiktok.com/ZSFPWjcfW/",
        "https://vt.tiktok.com/ZSFPWQkj7/",
        "https://vt.tiktok.com/ZSFPWksfC/",
        "https://vt.tiktok.com/ZSFPWXyys/",
        "https://vt.tiktok.com/ZSFPWj1Mh/",
        "https://vt.tiktok.com/ZSFPW5yf3/",
        "https://vt.tiktok.com/ZSFPWCTKX/",
        "https://vt.tiktok.com/ZSFPWjJ9g/",
        "https://vt.tiktok.com/ZSFPWmW3y/",
        "https://vt.tiktok.com/ZSFPW9bRm/",
        "https://vt.tiktok.com/ZSFPWXX9U/",
        "https://vt.tiktok.com/ZSFPWQ9jD/",
        "https://vt.tiktok.com/ZSFPWfS7a/",
        "https://vt.tiktok.com/ZSFPWhfnt/",
        "https://vt.tiktok.com/ZSFPW6PBn/",
        "https://vt.tiktok.com/ZSFPW6SUu/",
"https://vt.tiktok.com/ZSFPWj413/",
  "https://vt.tiktok.com/ZSFPWDUvf/",
  "https://vt.tiktok.com/ZSFPWBM2a/",
  "https://vt.tiktok.com/ZSFPWkWbE/",
  "https://vt.tiktok.com/ZSFPWPvbm/",
  "https://vt.tiktok.com/ZSFPWrXAg/",
  "https://vt.tiktok.com/ZSFPWAp7B/"
];

app.get('/codm', async function (req, res) {
  
  try {
    const randomCodm = Math.floor(Math.random() * addedLinks.length);
    const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${addedLinks[randomCodm]}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/addLink', (req, res) => {
  const { link } = req.query;

  if (!link) {
    return res.status(400).json({ error: 'Link is required' });
  }


  addedLinks.push(link);

  res.json({ success: true, message: 'Link added successfully' });
});
      
app.listen(port, () => console.log('Example app listening on port 3000!'));
 
