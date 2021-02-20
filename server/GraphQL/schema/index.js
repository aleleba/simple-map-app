const { gql } = require('apollo-server-express')

// The GraphQL schema

//type Mutation {}
const rootQuery = gql`

type Query {
  sinQuery: String
}

type Mutation {
  newPosition(position: [Float]): [Float]
}

type Subscription {
  newPosition: [Float]
}

`;

const typeDefs = [ rootQuery ]

module.exports = typeDefs