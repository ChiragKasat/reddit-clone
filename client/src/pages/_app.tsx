import { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
	return (
		<div className='font-poppins'>
			<Head>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Component {...pageProps}></Component>
		</div>
	);
}

export default App;
