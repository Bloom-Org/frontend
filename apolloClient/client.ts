import { ApolloClient, DefaultOptions, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import cookie from "react-cookies";

const APIURL = "https://api-v2-mumbai.lens.dev/";


const httpLink = createHttpLink({
    uri: APIURL,
});

const authLink = setContext((_, { headers }) => {
    let lensCookie = cookie.load("lensToken");
    console.log("lensCookie", lensCookie);
    return {
      headers: {
        ...headers,
        authorization: lensCookie?.token ? `Bearer ${lensCookie.token}` : "",
      }
    }
});

const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }


export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});
  
