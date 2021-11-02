import express from "express";
import NodeCache from "node-cache";
import fs from "fs";

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 500,
});

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/token/:tokenId", (req, res) => {
  const tokenId = parseInt(req.params.tokenId);
  console.log("url:", req.protocol + "://" + req.get("host") + req.originalUrl);

  if (isNaN(tokenId)) {
    res.sendStatus(404);
    return;
  }

  if (tokenId > 100) {
    res.sendStatus(404);
    return;
  }
  try {
    const tokenData = {
      name: `Test Paint Token #${tokenId}`,
      token_id: `${tokenId}`,
      description: "Paint Generated NFT",
      image: `${req.protocol}://${req.get("host")}/images${req.originalUrl}`,
      attributes: [
        {
          trait_type: "Coolness",
          value: "Very",
        },
      ],
    };

    res.setHeader("Content-Type", "application/json");

    cache.set(tokenId, tokenData);
    res.json(tokenData);
  } catch {
    res.sendStatus(404);
  }
});

app.get("/images/token/:tokenId", (req, res) => {
  const tokenId = parseInt(req.params.tokenId);

  if (isNaN(tokenId)) {
    res.sendStatus(404);
    return;
  }

  if (tokenId > 100) {
    res.sendStatus(404);
    return;
  }

  let img = __dirname + "/images/nft.png";
  fs.access(img, fs.constants.F_OK, (err) => {
    console.log(`${img} ${err ? "does not exist" : "exists"}`);
  });

  fs.readFile(img, (err, content) => {
    if (err) {
      res.setHeader("Content-Type", "text/html");
      res.send("Error fetching an image");
    } else {
      res.setHeader("Content-Type", "image/png");
      res.send(content);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});

// https://enigmatic-mountain-59518.herokuapp.com/
