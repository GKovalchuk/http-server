import makeServer from './server.js';

const port = 7070;
const server = makeServer();

server.listen(port, () => server);