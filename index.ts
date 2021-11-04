import express from "express";
import NodeCache from "node-cache";
import { ethers } from "ethers";
import router from "./routes/nftRoutes";

//Contract's ABI
import PunksJSON from "./json/Punks.json";

const app = express();
const port = process.env.PORT || 3001;
const networkURL =
  process.env.NETWORK_URL ||
  "https://rinkeby.infura.io/v3/74f98561ad324c25b84e97cce1fc119d";

const provider = ethers.getDefaultProvider(networkURL);

export const punksContract = new ethers.Contract(
  "0x1AE48b92061104900118070504d3441F0ba06A99",
  PunksJSON.abi,
  provider
);

export const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 500,
});

app.use(express.json());

app.use("", router);

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});

// https://enigmatic-mountain-59518.herokuapp.com/
