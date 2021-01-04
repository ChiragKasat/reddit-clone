import Head from 'next/head';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

interface LoginProps {}

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

const Login: React.FC<LoginProps> = () => {
	return (
		<div>
			<Head>
				<title>Reddit Clone | Login</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-100'>
				<div className='mb-6 text-4xl font-bold'>Sign in to your account</div>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={RegisterSchema}
					onSubmit={(values, { setSubmitting }) => {
						//TODO:
					}}
				>
					{({ isSubmitting }) => (
						<Form className='flex flex-col p-10 bg-white rounded-md shadow-md'>
							<label className='form-label'>Email</label>
							<Field type='email' name='email' className='input-box' />
							<ErrorMessage
								name='email'
								component='div'
								className='text-red-600'
							/>
							<label className='form-label'>Password</label>
							<Field type='password' name='password' className='input-box' />
							<ErrorMessage
								name='password'
								component='div'
								className='text-red-600'
							/>
							<button
								type='submit'
								disabled={isSubmitting}
								className='form-btn'
							>
								Login
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default Login;
