import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation
} from '../generated/graphql';
import { updateQueryGeneric } from './updateQueryGeneric';

export const createUrqlClient = (ssrExchange: any) => ({
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
		ssrExchange,
		fetchExchange
	],
	fetchOptions: {
		credentials: 'include' as const
	}
});
