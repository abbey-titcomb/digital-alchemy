const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname));

app.get('/generate', (req, res) => {
  request(
    { url: 'https://donjon.bin.sh/d20/random/rpc.cgi?type=Magic+Shop+Name&n=1&town_size=Small+Town&shop_type=Alchemist' },
    (error, response, name) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      request(
        { url: 'https://donjon.bin.sh/d20/random/rpc.cgi?type=Magic+Shop+Location&n=1&town_size=Small+Town&shop_type=Alchemist' },
        (error, response, location) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({ type: 'error', message: err.message });
          }
          request(
            { url: 'https://donjon.bin.sh/d20/random/rpc.cgi?type=Magic+Shop+Description&n=1&town_size=Small+Town&shop_type=Alchemist' },
            (error, response, description) => {
              if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
              }
              res.json({"name":JSON.parse(name),"location":JSON.parse(location), "description":JSON.parse(description)});
            })
        })
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
