# Employee System Full-Stack App

> Full Stack CRUD App

## App Info

### Frameworks

Front-End: [React.js](https://reactjs.org/), [Bootstrap CDN](https://getbootstrap.com/)

Back-End: [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/)

Testing: [Mocha.js](https://mochajs.org/), [Chai.js](https://www.chaijs.com/api/)

Database: [PostgreSQL](https://www.postgresql.org/)

Installation of the above applications is necessary for the app to run.


## Configurations

Under index.js folder (adjust the following configurations to your own computer):
``` bash
const configs = {
user: 'your computer username',
host: '127.0.0.1',
database: 'your database name',
port: 5432,
};
```


## Quick Start

``` bash
# Install dependencies for server
npm install

# Install dependencies for react
npm run client-install

# Run the react & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run react

# Run the Test folder (Positive Testing & Performance / Load Testing)
npm run test

# Server runs on http://localhost:5000 and client on http://localhost:3000
```



### Author

[Ryan Yeo](https://www.linkedin.com/in/ryan-yeo/)