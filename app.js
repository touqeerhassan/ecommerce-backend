const express = require('express');
const cors = require('cors');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');

const app = express();



const dir = path.join(__dirname, 'public');
app.use(express.static(dir));
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));