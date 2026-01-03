import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

import { ErrorLink } from '@apollo/client/link/error'

const errorLink = new ErrorLink((error: any) => {
  const { graphQLErrors, networkError } = error || {}

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) => {
      console.error(
        '[GraphQL error]: Message:',
        message,
        'Location:',
        locations,
        'Path:',
        path
      )
    })
  }

  if (networkError) {
    console.error('[Network error]:', networkError)
  }

  // no return (void)
})

const GITHUB_GraphQL_API = 'https://api.github.com/graphql'

const httpLink = new HttpLink({
  uri: GITHUB_GraphQL_API,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
})

const link = ApolloLink.from([errorLink, httpLink])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default client
