import { AppProps } from 'next/app';
import '../styles/globals.css';
import { Provider, createClient } from 'urql';

const client = createClient({
	url: 'http://localhost:4000/graphql',
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
