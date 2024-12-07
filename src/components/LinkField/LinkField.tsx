'use client';

import { useState } from 'react'
import styles from './LinkField.module.css'

// props interface for input field component
interface LinkFieldProps {
    handleAdd: (value: string) => void;
    loading?: boolean;
    placeholder?: string;
    validateUrl?: boolean;
}

const LinkField = ({
    handleAdd,
    loading = false,
    placeholder = "Paste link to add bookmark",
    validateUrl = false
}: LinkFieldProps) => {
    // state for input value and validation error
    const [input, setInput] = useState<string>('')
    const [error, setError] = useState<string>('')

    // validate input based on requirements
    function validateInput(value: string): boolean {
        // Clear previous error
        setError('');
        
        // Check if empty
        if (!value.trim()) {
            setError('This field is required');
            return false;
        }

        // If URL validation is required
        if (validateUrl) {
            try {
                new URL(value);
            } catch {
                setError('Please enter a valid URL (e.g., https://example.com)');
                return false;
            }
        }

        return true;
    }

    // handle enter key press
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            const newInput = input.trim()
            if (newInput && validateInput(newInput)) {
                e.preventDefault();
                handleAdd(newInput)
                setInput('')
            }
        }
    }

    function handleBlur() {
        if (input.trim()) {
            validateInput(input);
        }
    }

    return (
        <div className={styles.fieldContainer}>
            <div className={styles.inputContainer}>
                <input 
                    placeholder={placeholder} 
                    type="text" 
                    disabled={loading} 
                    value={input} 
                    onChange={e => {
                        setInput(e.target.value);
                        if (error) setError('');
                    }} 
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={error ? styles.inputError : ''}
                    aria-invalid={!!error}
                    aria-describedby={error ? "input-error" : undefined}
                />
            </div>
            {error && (
                <div className={styles.errorMessage} id="input-error" role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}

export default LinkField