import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import Head from 'next/head';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import { useForgotPasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface indexProps {}

const index: React.FC<indexProps> = () => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<div>
			<Head>
				<title>Forgot Password</title>
			</Head>
			<div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-100'>
				<div className='mb-6 text-4xl font-bold text-center'>
					Forgot Password
				</div>
				<Formik
					initialValues={{ email: '' }}
					onSubmit={async (values, { setErrors }) => {
						const response = await forgotPassword(values);

						if (response.data?.forgotPassword) {
							setComplete(true);
						} else if (!response.data?.forgotPassword) {
							setErrors({ email: 'email not registered' });
						}
					}}
				>
					{({ isSubmitting }) =>
						complete ? (
							<div className='mt-10 text-center'>
								An email with password reset link has been sent.
							</div>
						) : (
							<Form className='flex flex-col p-10 bg-white rounded-md shadow-md'>
								<InputField type='email' name='email' label='Email' />

								<button
									type='submit'
									disabled={isSubmitting}
									className='form-btn'
								>
									{isSubmitting ? (
										<div className='btn-spinner'></div>
									) : (
										<> Send link to reset password </>
									)}
								</button>
							</Form>
						)
					}
				</Formik>
			</div>
		</div>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: false })(index);
