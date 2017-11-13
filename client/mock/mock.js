const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

const middlewares = jsonServer.defaults();

server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));

server.post('/auth/login', (req, res) => {
  res.jsonp({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwidXNlcl9pZCI6MSwicGF0aWVudF9pZCI6MX0.gKJ0607b4HQsJD8VwRuA9t-kqoeL5MTC30FRCRrJzuI"
  })
});

server.get('/auth/user', (req, res) => {
  res.jsonp({
    id: 1,
    first_name: "Andre",
    last_name: "Boullivalant",
    email: "andreboullivalant@email.com"
  })
});

server.use((req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send();
    return;
  }
  next();
});

server.use(middlewares);
server.use(router);
server.listen(4201, () =>
  console.log('JSON Server is running'));
