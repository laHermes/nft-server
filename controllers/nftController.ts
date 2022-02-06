import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { cache, punksContract } from '../index';

const MAX_TOKENS_AMOUNT = 100;

const getTotalSupply = async () => {
	let totalSupply = await punksContract.totalSupply();
	return parseInt(ethers.utils.formatUnits(totalSupply, '0'));
};

// get Token JSON Metadata
const getTokenIdMetadata = async (req: any, res: any) => {
	let tokenData: any;
	const tokenId = parseInt(req.params.tokenId);
	const totalSupply = await getTotalSupply();

	if (isNaN(tokenId)) {
		res.sendStatus(404);
		return;
	}

	if (tokenId > MAX_TOKENS_AMOUNT) {
		res.sendStatus(404);
		return;
	}

	if (tokenId > totalSupply) {
		tokenData = {
			name: `Test Paint Token #${tokenId}`,
			token_id: `${tokenId}`,
			description: 'Paint Generated NFT',
			image: `${req.protocol}://${req.get('host')}/images${req.originalUrl}`,
		};
	} else {
		// hardcoded values
		// use generated JSON for data
		tokenData = {
			name: `Test Paint Token #${tokenId}`,
			token_id: `${tokenId}`,
			description: 'Paint Generated NFT',
			image: `${req.protocol}://${req.get('host')}/images${req.originalUrl}`,
			attributes: [
				{
					trait_type: 'Coolness',
					value: 'Very',
				},
			],
		};
	}

	try {
		res.setHeader('Content-Type', 'application/json');

		cache.set(tokenId, tokenData);
		res.json(tokenData);
	} catch {
		res.sendStatus(404);
	}
};
// get Token Image
const getTokenIdImage = async (req: any, res: any) => {
	const totalSupply = await getTotalSupply();

	const tokenId = Math.abs(parseInt(req.params.tokenId));

	if (isNaN(tokenId)) {
		res.sendStatus(404);
		return;
	}

	if (tokenId > MAX_TOKENS_AMOUNT) {
		res.sendStatus(404);
		return;
	}

	let reqPath = path.join(__dirname, '../');
	let img = reqPath + '/images/notYet.png';

	if (tokenId <= totalSupply) {
		img = reqPath + '/images/nft.png';
	}

	fs.access(img, fs.constants.F_OK, (err) => {
		console.log(`${img} ${err ? 'does not exist' : 'exists'}`);
	});

	fs.readFile(img, (err, content) => {
		if (err) {
			res.setHeader('Content-Type', 'text/html');
			res.send('Error fetching an image');
		} else {
			res.setHeader('Content-Type', 'image/png');
			res.send(content);
		}
	});
};
export { getTokenIdMetadata, getTokenIdImage };
