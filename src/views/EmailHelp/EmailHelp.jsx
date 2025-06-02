import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import Loading from '../../components/loading/loading';
import getUserData from '../../utils/getcurrentuser';
import { useForm } from "react-hook-form";
import { Form, FormGroup } from "reactstrap";
import { Input, TextareaAutosize, Alert, FormHelperText } from "@mui/material";
import { logError, getUserFriendlyErrorMessage } from '../../utils/errorHandler';
import ErrorBoundary from '../../components/errorboundary/ErrorBoundary';
import { sanitizeObject, createValidationRules } from '../../utils/inputValidation';

export default function ContactUs() {
    const currUserQuery = getUserData(); 
    const formRef = React.useRef();
    const [status, setStatus] = useState({ success: false, error: null });

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const updateValue = (e) => {
        setValue(e.target.name, e.target.value);
    };

    const sendEmail = async (formData) => {
        try {
            // Add user data to form
            formData.user_name = currUserQuery.data.preferredname;
            formData.user_email = currUserQuery.data.email;

            // Sanitize form data to prevent XSS attacks
            const sanitizedData = sanitizeObject(formData);

            // Send email
            const response = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                sanitizedData,
                import.meta.env.VITE_EMAILJS_USER_ID
            );

            // Handle success
            setStatus({ success: true, error: null });

            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                console.log('Email sent successfully');
            }

            // Reload after a short delay to show success message
            setTimeout(() => window.location.reload(), 2000);

            return response;
        } catch (error) {
            // Log error safely
            logError(error, 'EmailHelp.sendEmail');

            // Set user-friendly error message
            setStatus({ success: false, error: getUserFriendlyErrorMessage(error) });

            throw error;
        }
    };

    const handleFormSubmit = async (data) => {
        // Reset status
        setStatus({ success: false, error: null });

        try {
            await sendEmail(data);
        } catch (error) {
            // Error is already handled in sendEmail
        }
    };

    // Loading state
    if (currUserQuery.isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    // Error state
    if (currUserQuery.isError || (!currUserQuery.isError && currUserQuery.data === undefined)) {
        return (
            <div className="error-message">
                <Alert severity="error">
                    Unable to load user data. Please try again later.
                </Alert>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            {status.success && (
                <Alert severity="success" sx={{ marginBottom: 2 }}>
                    Your message has been sent successfully!
                </Alert>
            )}

            {status.error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {status.error}
                </Alert>
            )}

            <Form ref={formRef}>
                <FormGroup>
                    <label>Name</label>
                    <Input 
                        type="text" 
                        id="user_name" 
                        disabled={true} 
                        {...register('user_name')} 
                        onChange={(e) => updateValue(e)}
                        defaultValue={currUserQuery.data.preferredname} 
                    />
                    <label>Email</label>
                    <Input 
                        type="email" 
                        id="user_email" 
                        disabled={true} 
                        {...register('user_email')} 
                        onChange={(e) => updateValue(e)}
                        defaultValue={currUserQuery.data.email}
                    />
                    <label>Subject</label>
                    <Input 
                        type="text" 
                        id="subject"  
                        {...register('subject', createValidationRules({
                            required: true,
                            requiredMessage: 'Subject is required',
                            minLength: 3,
                            maxLength: 100
                        }))} 
                        onChange={(e) => updateValue(e)}
                        error={!!errors.subject}
                    />
                    {errors.subject && (
                        <FormHelperText error>{errors.subject.message}</FormHelperText>
                    )}
                    <label>Message</label>
                    <TextareaAutosize 
                        id="message"  
                        {...register('message', createValidationRules({
                            required: true,
                            requiredMessage: 'Message is required',
                            minLength: 10,
                            maxLength: 1000
                        }))} 
                        onChange={(e) => updateValue(e)}
                        minRows={4}
                        style={{ borderColor: errors.message ? 'red' : undefined }}
                    />
                    {errors.message && (
                        <FormHelperText error>{errors.message.message}</FormHelperText>
                    )}
                </FormGroup>
            </Form>
            <button 
                className="button-save" 
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Send'}
            </button>
        </ErrorBoundary>
    );
}
