import fs from 'fs/promises';
import { nanoid } from 'nanoid';

export const noValidData = (incomingData) => {
	let badData = [];
	if (incomingData.userId.length !== 16) return true;
	return false;
};

export const updateData = async (newData) => {
	try {
		const keyData = JSON.parse(await fs.readFile("./keyData.json", "utf8"));
		const keySwitcher = ({ id, userId, content }) => ({ id, userId: keyData[userId], content });
		const aggData = JSON.parse(await fs.readFile("./chatData.json", "utf8"));
		aggData.push(keySwitcher(newData));
		await fs.writeFile("./chatData.json", JSON.stringify(aggData));
		return aggData;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export const createNewKey = async (userId) => {
	const keyData = JSON.parse(await fs.readFile("./keyData.json", "utf8"));
	if (keyData[userId] !== undefined) {
		console.log(keyData[userId]);
		return keyData[userId];
	};
	keyData[userId] = nanoid(8);
	await fs.writeFile('./keyData.json', JSON.stringify(keyData));
	return keyData[userId];
}

export const checkKey = (userId) => {
	try {
		if (userId.length !== 16) {
			console.log(`${userId} userId is not valid`);
			return true
		};
		return false;
	} catch (err) {
		console.log(`${userId} userId is not valid`);
		console.error(err);
		return true;
	}



}


