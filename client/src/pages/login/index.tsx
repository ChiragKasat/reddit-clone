import Link from 'next/link';
import Head from 'next/head';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface LoginProps {}

const LoginSchema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Required')
});

const Login: React.FC<LoginProps> = () => {
	const router = useRouter();
	const [, login] = useLoginMutation();

	return (
		<div>
			<Head>
				<title>Reddit Clone | Login</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-100'>
				<div className='mb-6 text-4xl font-bold text-center'>
					Sign in to your account
				</div>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={LoginSchema}
					onSubmit={async (values, { setErrors }) => {
						const response = await login(values);
						if (response.data?.login.errors) {
							setErrors(toErrorMap(response.data.login.errors));
						} else if (response.data?.login.user) {
							router.push('/');
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className='flex flex-col p-10 bg-white rounded-md shadow-md'>
							<InputField type='email' name='email' label='Email' />
							<InputField type='password' name='password' label='Password' />

							<Link href='/forgot-password'>
								<a className='py-2 text-right text-teal-500'>
									Forgot your password?
								</a>
							</Link>

							<button
								type='submit'
								disabled={isSubmitting}
								className='mt-2 form-btn'
							>
								{isSubmitting ? (
									<div className='btn-spinner'></div>
								) : (
									<> Login </>
								)}
							</button>
						</Form>
					)}
				</Formik>
				<div className='p-5 sm:text-lg'>
					New here?{' '}
					<Link href='/register'>
						<a className='font-bold text-teal-500'>Register</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
