
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeInput, securitySchemas } from '@/utils/securityValidation';
import { z } from 'zod';

interface SecureInputProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
  maxLength?: number;
  validationType?: keyof typeof securitySchemas;
  allowHTML?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  type = 'text',
  name,
  placeholder,
  value: controlledValue,
  onChange,
  required = false,
  className = '',
  maxLength = 1000,
  validationType,
  allowHTML = false
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [error, setError] = useState<string>('');
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const validateInput = useCallback((inputValue: string) => {
    if (!inputValue && required) {
      return 'This field is required';
    }

    if (validationType && inputValue) {
      try {
        securitySchemas[validationType].parse(inputValue);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid input';
        }
      }
    }

    return '';
  }, [required, validationType]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    
    // Sanitize input
    const sanitized = sanitizeInput(rawValue, { 
      allowHTML, 
      maxLength 
    });
    
    // Validate
    const validationError = validateInput(sanitized);
    setError(validationError);
    
    // Update value
    if (controlledValue !== undefined) {
      onChange?.(sanitized);
    } else {
      setInternalValue(sanitized);
    }
  }, [controlledValue, onChange, allowHTML, maxLength, validateInput]);

  return (
    <div className="space-y-1">
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className={`${className} ${error ? 'border-destructive' : ''}`}
        maxLength={maxLength}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
