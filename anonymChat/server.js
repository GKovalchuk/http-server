import http, { request } from 'http';
import router from './router.js';

export default () => http.createServer((request, response) => {
	const body = [];
	request.on('error', (err) => console.error(err.stack));
	request.on('data', (chunk) => body.push(chunk.toString()))
		.on('end', () => {
			const { pathname } = new URL(request.url, `http://${request.headers.host}`);
			const routes = router[request.method];
			try {
				const findRoute = () => Object.keys(routes).find((str) => {
					if (str !== pathname) return false;
					response.setHeader('Access-Control-Allow-Methods', "POST, GET");
					response.setHeader('Access-Control-Allow-Origin', "*");
					response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
					routes[str](response, body);
					return true;
				});
				const validAddress = (pathname && findRoute()) ?? false;
				if (!validAddress) {
					response.setHeader('Access-Control-Allow-Methods', "POST, GET");
					response.setHeader('Access-Control-Allow-Origin', "*");
					response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
					response.writeHead(404);
					response.end();
				}
			} catch (err) {
				console.log(pathname, request.body);
				console.log(err)
			}
		});
	request.resume();
});