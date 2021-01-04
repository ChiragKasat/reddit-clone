import { ErrorMessage, Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
};

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
	const [field] = useField(props);

	return (
		<div className='flex flex-col'>
			<label htmlFor={field.name} className='form-label'>
				{label}
			</label>
			<Field {...props} className='input-box' id={field.name} />
			<ErrorMessage
				name={field.name}
				component='div'
				className='text-red-600'
			/>
		</div>
	);
};

export default InputField;
