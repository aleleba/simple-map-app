'use strict'

// A map of functions which return data for the schema.

const resolvers = {
  Query: {
    sinQuery: (rootValue, args, context) => 'no existe ningun query'
  },
  Mutation: {
    newPosition: (rootValue, args, context) => {

      let position = args.position

      context.pubsub.publish('NEW_POSITION', {
          newPosition: position
      })
      return args.position
    }
  },
  Subscription: {
    newPosition: {
      subscribe: (rootValue, args, context) => {
        return context.pubsub.asyncIterator('NEW_POSITION')
      }
    }
  }

};

module.exports = resolvers;