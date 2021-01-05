import { AppProps } from 'next/app';
import '../styles/globals.css';
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation
} from '../generated/graphql';

function updateQueryGeneric<Result, Query>(
	cache: Cache,
	queryInput: QueryInput,
	result: any,
	updateFunction: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(
		queryInput,
		data => updateFunction(result, data as any) as any
	);
}

const client = createClient({
	url: 'http://localhost:4000/graphql',
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (_result, args, cache, info) => {
						updateQueryGeneric<LoginMutation, MeQuery>(
							cache,
							{
								query: MeDocument
							},
							_result,
							(result, query) => {
								if (result.login.errors) {
									return query;
								} else {
									return {
										me: result.login.user
									};
								}
							}
						);
					},
					register: (_result, args, cache, info) => {
						updateQueryGeneric<RegisterMutation, MeQuery>(
							cache,
							{
								query: MeDocument
							},
							_result,
							(result, query) => {
								if (result.register.errors) {
									return query;
								} else {
									return {
										me: result.register.user
									};
								}
							}
						);
					}
				}
			}
		}),
		fetchExchange
	],
	fetchOptions: {
		credentials: 'include'
	}
});

function App({ Component, pageProps }: AppProps) {
	return (
		<Provider value={client}>
			<Component {...pageProps}></Component>
		</Provider>
	);
}

export default App;
