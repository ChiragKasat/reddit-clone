import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
	return (
		<div className='min-h-screen bg-gray-100'>
			<Head>
				<title>Reddit Clone | Home Page</title>
			</Head>
			<Navbar />
		</div>
	);
}
