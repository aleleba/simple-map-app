import ApolloClient from 'apollo-client';

import { WebSocketLink } from 'apollo-link-ws';

import { apiUrl, wwUrl } from './ApiUrl';

import { InMemoryCache } from 'apollo-boost';

const wsLink = new WebSocketLink({
    uri: wwUrl,
    options: {
      reconnect: true
    }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink,
    uri: apiUrl
});


export default client