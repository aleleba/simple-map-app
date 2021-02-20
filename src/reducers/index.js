import apolloClient from './ApolloClient';
import dataPosition from './dataPosition';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    apolloClient,
    dataPosition
  })
  
  export default rootReducer

