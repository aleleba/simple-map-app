import client from '../ApolloClient';

const initialState = {
    client
}
  
let apolloClient = (state = initialState, action) => {
    switch (action.type) {

        /*case 'ALGUN_CASO': {
            //lOGICA DEL CASO
        }*/

        //break;
        default:
        return state
    }
}
  
export default apolloClient