import Link from 'next/link';
import React from 'react';
import { useMeQuery } from '../generated/graphql';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const [{ data }] = useMeQuery();

	let body = null;
	if (data?.me) {
		body = (
			<nav className='flex flex-wrap items-center justify-center text-base md:ml-auto'>
				<Link href='/'>
					<a className='navbar-link'>{data.me?.username}</a>
				</Link>
				<button className='navbar-link'>Logout</button>
			</nav>
		);
	} else {
		body = (
			<nav className='flex flex-wrap items-center justify-center text-base md:ml-auto'>
				<Link href='/login'>
					<a className='navbar-link'>Login</a>
				</Link>
				<Link href='/register'>
					<a className='navbar-link'>Register</a>
				</Link>
			</nav>
		);
	}
	return (
		<>
			<header className='text-gray-600 bg-white body-font'>
				<div className='container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row'>
					<Link href='/'>
						<a className='flex items-center mb-4 ml-3 text-xl font-medium text-gray-900 transition-colors duration-200 title-font md:mb-0 hover:text-teal-500'>
							Reddit Clone
						</a>
					</Link>
					{body}
				</div>
			</header>
		</>
	);
};

export default Navbar;
