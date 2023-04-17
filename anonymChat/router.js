import chatData from "./chatData.json"assert {
	type: "json"
};
import { noValidData, createNewKey, updateData, checkKey } from './helpers.js';

const router = {
	GET: {
		'/': (res, body) => {
			res.setHeader('Content-Type', 'application/json');
			const data = JSON.stringify(chatData);
			res.end(JSON.stringify(chatData));
		},
	},
	OPTIONS: {
		"/createNewKey": (res, body) => {
			res.end();
		},
		"/": (res, body) => {
			res.end();
		},
	},
	POST: {
		'/': async (res, body) => {
			const incomingData = JSON.parse(body);
			const badData = noValidData(incomingData);
			if (badData) {
				res.writeHead(400);
				res.end();
				return;
			}
			const newData = await updateData(incomingData);
			if (!newData) {
				res.writeHead(400);
				res.end();
				return;
			}
			res.writeHead(201);
			res.end(JSON.stringify(newData));
		},
		'/createNewKey': async (res, body) => {
			const { userId } = JSON.parse(body);
			const serverSideUserId = await createNewKey(userId);
			const badData = checkKey(userId);
			if (badData) {
				res.writeHead(400);
				res.end();
				return;
			}
			res.writeHead(201);
			res.end(JSON.stringify({ [userId]: serverSideUserId }));
		},
	},
};

export default router;