import Head from 'next/head';
import Navbar from '../components/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Home = () => {
	return (
		<div className='min-h-screen bg-gray-100'>
			<Head>
				<title>Reddit Clone | Home Page</title>
			</Head>
			<Navbar />
		</div>
	);
};

export default withUrqlClient(createUrqlClient)(Home);
