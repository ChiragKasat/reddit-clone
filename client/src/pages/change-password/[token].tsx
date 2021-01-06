import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const PasswordSchema = yup.object().shape({
	newPassword: yup
		.string()
		.min(5, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required')
});

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const router = useRouter();
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');

	return (
		<div>
			<Head>
				<title>Change Password</title>
			</Head>
			<div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-100'>
				<div className='mb-6 text-4xl font-bold'>Change your password</div>
				<Formik
					initialValues={{ newPassword: '' }}
					validationSchema={PasswordSchema}
					onSubmit={async (values, { setErrors }) => {
						const response = await changePassword({ ...values, token });
						if (response.data?.changePassword.errors) {
							const errorMap = toErrorMap(response.data.changePassword.errors);

							if ('token' in errorMap) {
								setTokenError(errorMap.token);
							}

							setErrors(errorMap);
						} else if (response.data?.changePassword.user) {
							router.push('/');
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className='flex flex-col p-10 bg-white rounded-md shadow-md'>
							<InputField
								type='password'
								name='newPassword'
								label='New Password'
							/>

							{tokenError ? (
								<div className='text-red-600'>{tokenError}</div>
							) : null}

							<button
								type='submit'
								disabled={isSubmitting}
								className='form-btn'
							>
								{isSubmitting ? (
									<div className='btn-spinner'></div>
								) : (
									<> Change Password </>
								)}
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

ChangePassword.getInitialProps = ({ query }) => {
	return {
		token: query.token as string
	};
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
	ChangePassword as any
);
