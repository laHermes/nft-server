import express from "express";
import tokenMetadata from "./json/metadata.json";

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/token/:tokenId", (req, res) => {
  const tokenId = parseInt(req.params.tokenId);

  if (isNaN(+tokenId)) {
    res.sendStatus(404);
    return;
  }

  if (tokenId > tokenMetadata.length - 1) {
    res.sendStatus(404);
    return;
  }

  let data = tokenMetadata[tokenId];
  res.send(data);
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
