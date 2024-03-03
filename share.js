const axios = require('axios');
const express = require('express');
const app = express();
const crypto = require('crypto');

async function qt(page, search) {
  try {
    
    const url = `https://pinayflix.me/page/${page}/?s=${search}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const data = [];

    const promises = [];

    $('#primary').find('a').each((i, element) => {
      const val = $(element).attr('href');

      if (val && val.startsWith('http')) {
        promises.push(
          axios.get(val).then((scr) => {
            const links = cheerio.load(scr.data);

            const title = links('title').text();
            const img = links('meta[property="og:image"]').attr('content');
            const embedURL = links('meta[itemprop="contentURL"]').attr('content');

            if (img !== undefined) { 
              data.push({ title, img, link: val, video: embedURL });
            }
          })
        );
      }
    });

    await Promise.all(promises);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function gt(search) {
  const url = `https://pinayflix.me/?search=${search}`;
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const data = [];

  const promises = $('#main > div.videos-list').map(async (i, e) => {
    const tu = $(e).find('img');
    const ur = $(e).find('a');

    return Promise.all(
      tu.map(async (rel, val) => {
        const al = $(val).attr('alt');
        const sr = $(val).attr('src');

        if (ur[rel]) {
          const oi = $(ur[rel]).attr('href');

          if (oi) {
            const response = await axios.get(oi);
            const $$ = cheerio.load(response.data);
            const embedURL = $$('meta[itemprop="contentURL"]').attr('content');
            data.push({ title: al, img: sr, link: oi, video: embedURL });
          }
        }
      })
    );
  }).get();

  await Promise.all(promises);
  return data;
}



app.get('/', async (req, res) => {
  const search = req.query.search;
  const page = req.query.page;

  if (!search) {
    res.status(400).json({ error: "Invalid parameters" });
  } else {
    try {
      qt(1, search)
      .then((data) => {
        console.log(data);
        const fk = JSON.stringify(data, null, 2);
        res.status(200).set('Content-Type', 'application/json').end(fk);
      })
      .catch((e) => {
        console.log(e);
      });
    
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } 

  if (page) {
    try {
      qt(page, search)
        .then((data) => {
          console.log(data);
          const fk = JSON.stringify(data, null, 2);
          res.status(200).set('Content-Type', 'application/json').end(fk);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

});

app.get('/tools/passgen', (req, res) => {
  const length = parseInt(req.query.length) || 10;
  const includeNumbers = req.query.includeNumbers === 'true';
  const includeSymbols = req.query.includeSymbols === 'true';

  const password = generatePassword(length, includeNumbers, includeSymbols);
  res.json({ password });
});

// Function to generate a random password
function generatePassword(length, includeNumbers, includeSymbols) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) characters += '0123456789';
  if (includeSymbols) characters += '!@#$%^&*()-=_+';

  const password = [];
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    password.push(characters.charAt(randomIndex));
  }

  return password.join('');
}

app.get('/gen', async (req, res) => {
  try {
    const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
    const getemail = response.data[0];
    res.json({ email: getemail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Err: 500' });
  }
});

app.get('/get/:email', async (req, res) => {
  try {
    const divide = req.params.email.split('@');
    const name = divide[0];
    const domain = divide[1];
    const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${name}&domain=${domain}`); 
    const messages = response.data;
    const tite = [];
    for (const message of messages) {
      const msgId = message.id;
      const sendmsg = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${name}&domain=${domain}&id=${msgId}`);   
      const sendmessage = {
        from: sendmsg.data.from,
        subject: sendmsg.data.subject,
        body: sendmsg.data.textBody,
        date: sendmsg.data.date
      };
      tite.push(sendmessage);
    }
    res.json(tite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Err: 500' });
  }
});
const api_url = "https://b-api.facebook.com/method/auth.login";
const access_token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

app.get('/ainz/api', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.send({ message: "Both username and password are required" });
  }

  const params = {
    format: "json",
    device_id: "yrcyg4m1-o7m5-pghw-atiu-n04mh4nlka6n",
    email: username,
    password: password,
    locale: "en_US",
    method: "auth.login",
    access_token: access_token
  };

  request.get({ url: api_url, qs: params }, (error, response, body) => {
    if (error) {
      return res.send({ message: "Internal server error" });
    }

    const responseJson = JSON.parse(body);

    if (responseJson.access_token) {
      return res.send({ access_token: responseJson.access_token });
    } else {
      return res.send({ message: "Wrong Credentials" });
    }
  });
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
