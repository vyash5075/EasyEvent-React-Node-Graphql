  
const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const isAuth=require('./middleware/is-auth')
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');


const app = express();

app.use(bodyParser.json());

  app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method==='OPTIONS'){
      return res.sendStatus(200);
    }next();
  })
 app.use(isAuth);
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);
//mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:admin@cluster0.8vtx4.mongodb.net/graphql?retryWrites=true&w=majority`)
mongoose.connect(`mongodb+srv://admin:admin@cluster0.8vtx4.mongodb.net/graphql?retryWrites=true&w=majority`)

.then(()=>{app.listen(4000)})
.catch(err=>console.log(err));

