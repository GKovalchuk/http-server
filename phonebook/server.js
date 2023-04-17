import http from 'http';

export default (usersById) => http.createServer((request, response) => {
	request.on('error', (err) => console.error(err.stack));
	request.on('end', () => {
		const getUrlData = () => {
			const url = new URL(request.url, `http://${request.headers.host}`);
			return [url.searchParams, url.pathname];
		};

		const getSearchParams = (params) => params.map((item) => {
			const value = searchParams.get(item);
			if (!value) return null;
			return value.toLowerCase();
		});

		const filterPhonebook = (q) => Object.entries(usersById)
			.filter(([, { name }]) => name.toLowerCase().includes(q))
			.reduce((acc, [, { name, phone }]) => acc.concat({ name, phone }), []);

		const getPagesJson = (page = 1, perPage = 10) => {
			const totalPages = Math.ceil((getObjectLength()) / perPage);
			if (page > totalPages) page = totalPages;
			if (page < 1) page = 1;
			const pageDataend = perPage * page;
			const pageDataStart = pageDataend - perPage;

			const data = Object.entries(usersById)
				.slice(pageDataStart, pageDataend)
				.map(([, { name, phone }]) => ({ name, phone }));
			const sumData = { meta: { page, perPage, totalPages }, data };

			response.setHeader('Content-Type', 'application/json');
			response.write(JSON.stringify(sumData));
			return '';
		};

		const getObjectLength = (object = usersById) => Object.keys(object).length;

		const responseLogic = () => {
			switch (pathname) {
				case '/': {
					const messages = [
						'\nWelcome to The Phonebook',
						`Records count: ${getObjectLength()}`,
					];
					return messages.join('\n');
				}
				case '/searchId': {
					const [q] = getSearchParams(['q']);
					if (usersById[q]) return `${q} id's name: ${usersById[q].name}`;
					return `no such id exists (${q})`;
				}
				case '/search.json': {
					const [q] = getSearchParams(['q']);
					response.setHeader('Content-Type', 'application/json');
					if (!q) return '';
					response.write(JSON.stringify(filterPhonebook(q)));
					return '';
				}
				case '/search': {
					const [q] = getSearchParams(['q']);
					if (!q) return '';
					return filterPhonebook(q).map(({ name, phone }) => `${name}, ${phone}`)
						.join('/n');
				}
				case '/users.json': {
					const [page, perPage] = getSearchParams(['page', 'perPage'])
						.map((i) => i ? Number(i) : undefined);
					return getPagesJson(page, perPage);
				}
				default: {
					return '';
				}
			}
		};

		const [searchParams, pathname] = getUrlData();
		const message = responseLogic();
		response.end(message);
	});

	request.resume();
});
