import fs from 'fs/promises';
import makeServer from './server.js';

const port = 8080;
const data = await fs.readFile('phonebook.txt', 'utf-8');
const dataObj = {};
data.trim()
	.split('\n')
	.forEach((entry) => {
		const entryArr = entry.split(' | ');
		dataObj[entryArr[0]] = { name: entryArr[1], phone: entryArr[2] };
	});

const server = makeServer(dataObj);
server.listen(port, () => server);
