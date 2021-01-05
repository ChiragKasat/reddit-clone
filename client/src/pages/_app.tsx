import { AppProps } from 'next/app';
import '../styles/globals.css';
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
	LogoutMutation
} from '../generated/graphql';
import Head from 'next/head';

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
					},
					logout: (_result, args, cache, info) => {
						updateQueryGeneric<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							() => ({
								me: null
							})
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
			<div className='font-poppins'>
				<Head>
					<link rel='icon' href='/favicon.ico' />
				</Head>
				<Component {...pageProps}></Component>
			</div>
		</Provider>
	);
}

export default App;
