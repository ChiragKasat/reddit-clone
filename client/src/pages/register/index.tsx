import Head from 'next/head';
import Link from 'next/link';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import { useRegisterMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface RegisterProps {}

const RegisterSchema = yup.object().shape({
	username: yup
		.string()
		.min(3, 'Too Short!')
		.max(25, 'Too Long!')
		.required('Required')
		.trim(),
	password: yup
		.string()
		.min(5, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	email: yup.string().email('Invalid email').required('Required')
});

const Register: React.FC<RegisterProps> = () => {
	const [, register] = useRegisterMutation();
	const router = useRouter();

	return (
		<div>
			<Head>
				<title>Reddit Clone | Register</title>
			</Head>

			<div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-100'>
				<div className='mb-6 text-4xl font-bold'>Register your account</div>
				<Formik
					initialValues={{ username: '', email: '', password: '' }}
					validationSchema={RegisterSchema}
					onSubmit={async (values, { setErrors }) => {
						const response = await register(values);
						if (response.data?.register.errors) {
							setErrors(toErrorMap(response.data.register.errors));
						} else if (response.data?.register.user) {
							router.push('/');
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className='flex flex-col p-10 bg-white rounded-md shadow-md'>
							<InputField type='text' name='username' label='Username' />
							<InputField type='email' name='email' label='Email' />
							<InputField type='password' name='password' label='Password' />
							<button
								type='submit'
								disabled={isSubmitting}
								className='form-btn'
							>
								{isSubmitting ? (
									<div className='btn-spinner'></div>
								) : (
									<> Register </>
								)}
							</button>
						</Form>
					)}
				</Formik>
				<div className='p-5 sm:text-lg'>
					Already registered?{' '}
					<Link href='/login'>
						<a className='font-bold text-teal-500'>Login</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
