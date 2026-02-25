import React, { forwardRef, useId } from 'react';

// ============================================

// ACCESSIBLE INPUT

// ============================================

export const AccessibleInput = forwardRef(({

  label,

  error,

  helpText,

  required,

  type = 'text',

  className = '',

  ...props

}, ref) => {

  const id = useId();

  const errorId = `${id}-error`;

  const helpId = `${id}-help`;

  return (

    <div className={`form-field ${className}`}>

      <label 

        htmlFor={id}

        className={required ? 'required' : ''}

      >

        {label}

      </label>

      

      <input

        ref={ref}

        id={id}

        type={type}

        aria-required={required}

        aria-invalid={!!error}

        aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined}

        className={error ? 'input-error' : ''}

        {...props}

      />

      

      {helpText && (

        <p id={helpId} className="help-text">

          {helpText}

        </p>

      )}

      

      {error && (

        <p id={errorId} className="field-error" role="alert">

          {error}

        </p>

      )}

      <style jsx>{`

        .form-field {

          margin-bottom: 20px;

        }

        

        label {

          display: block;

          font-weight: 500;

          margin-bottom: 8px;

          color: #374151;

        }

        

        .required::after {

          content: " *";

          color: #dc2626;

        }

        

        input {

          width: 100%;

          padding: 12px 16px;

          border: 2px solid #d1d5db;

          border-radius: 8px;

          font-size: 16px;

          transition: border-color 0.2s, box-shadow 0.2s;

          min-height: 48px;

        }

        

        input:focus {

          outline: none;

          border-color: #667eea;

          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);

        }

        

        input.input-error {

          border-color: #dc2626;

          background-color: #fef2f2;

        }

        

        .help-text {

          font-size: 14px;

          color: #6b7280;

          margin-top: 4px;

        }

        

        .field-error {

          font-size: 14px;

          color: #dc2626;

          margin-top: 4px;

          display: flex;

          align-items: center;

          gap: 4px;

        }

        

        .field-error::before {

          content: "⚠️";

        }

      `}</style>

    </div>

  );

});

// ============================================

// ACCESSIBLE SELECT

// ============================================

export const AccessibleSelect = forwardRef(({

  label,

  options,

  error,

  helpText,

  required,

  placeholder = 'Select an option',

  className = '',

  ...props

}, ref) => {

  const id = useId();

  const errorId = `${id}-error`;

  const helpId = `${id}-help`;

  return (

    <div className={`form-field ${className}`}>

      <label 

        htmlFor={id}

        className={required ? 'required' : ''}

      >

        {label}

      </label>

      

      <select

        ref={ref}

        id={id}

        aria-required={required}

        aria-invalid={!!error}

        aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined}

        className={error ? 'input-error' : ''}

        {...props}

      >

        <option value="">{placeholder}</option>

        {options.map(opt => (

          <option key={opt.value} value={opt.value}>

            {opt.label}

          </option>

        ))}

      </select>

      

      {helpText && (

        <p id={helpId} className="help-text">

          {helpText}

        </p>

      )}

      

      {error && (

        <p id={errorId} className="field-error" role="alert">

          {error}

        </p>

      )}

      <style jsx>{`

        select {

          width: 100%;

          padding: 12px 16px;

          border: 2px solid #d1d5db;

          border-radius: 8px;

          font-size: 16px;

          background: white;

          cursor: pointer;

          min-height: 48px;

          appearance: none;

          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");

          background-repeat: no-repeat;

          background-position: right 12px center;

          background-size: 20px;

          padding-right: 44px;

        }

        

        select:focus {

          outline: none;

          border-color: #667eea;

          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);

        }

      `}</style>

    </div>

  );

});

// ============================================

// ACCESSIBLE RADIO GROUP

// ============================================

export const AccessibleRadioGroup = ({

  label,

  name,

  options,

  value,

  onChange,

  error,

  required,

  orientation = 'vertical',

  className = ''

}) => {

  const groupId = useId();

  const errorId = `${groupId}-error`;

  return (

    <fieldset 

      className={`radio-group ${orientation} ${className}`}

      role="radiogroup"

      aria-labelledby={`${groupId}-label`}

      aria-required={required}

      aria-invalid={!!error}

      aria-describedby={error ? errorId : undefined}

    >

      <legend 

        id={`${groupId}-label`}

        className={required ? 'required' : ''}

      >

        {label}

      </legend>

      

      <div className="radio-options">

        {options.map((opt, index) => {

          const optionId = `${groupId}-${index}`;

          return (

            <label key={opt.value} className="radio-option" htmlFor={optionId}>

              <input

                type="radio"

                id={optionId}

                name={name}

                value={opt.value}

                checked={value === opt.value}

                onChange={(e) => onChange(e.target.value)}

                aria-describedby={opt.description ? `${optionId}-desc` : undefined}

              />

              <span className="radio-checkmark" aria-hidden="true"></span>

              <span className="radio-label">

                {opt.label}

                {opt.description && (

                  <span id={`${optionId}-desc`} className="radio-description">

                    {opt.description}

                  </span>

                )}

              </span>

            </label>

          );

        })}

      </div>

      

      {error && (

        <p id={errorId} className="field-error" role="alert">

          {error}

        </p>

      )}

      <style jsx>{`

        .radio-group {

          border: none;

          padding: 0;

          margin: 0 0 20px 0;

        }

        

        legend {

          font-weight: 500;

          margin-bottom: 12px;

          color: #374151;

        }

        

        .radio-options {

          display: flex;

          flex-direction: ${orientation === 'vertical' ? 'column' : 'row'};

          gap: 12px;

        }

        

        .radio-option {

          display: flex;

          align-items: flex-start;

          gap: 12px;

          cursor: pointer;

          padding: 12px;

          border: 2px solid #e5e7eb;

          border-radius: 8px;

          transition: all 0.2s;

          min-height: 48px;

        }

        

        .radio-option:hover {

          border-color: #667eea;

          background: #f8f8ff;

        }

        

        .radio-option:has(input:checked) {

          border-color: #667eea;

          background: linear-gradient(135deg, #f0f0ff 0%, #e8e8ff 100%);

        }

        

        .radio-option input {

          position: absolute;

          opacity: 0;

          width: 48px;

          height: 48px;

        }

        

        .radio-checkmark {

          width: 24px;

          height: 24px;

          border: 2px solid #9ca3af;

          border-radius: 50%;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          transition: all 0.2s;

        }

        

        .radio-option:has(input:checked) .radio-checkmark {

          border-color: #667eea;

          background: #667eea;

        }

        

        .radio-option:has(input:checked) .radio-checkmark::after {

          content: "";

          width: 8px;

          height: 8px;

          background: white;

          border-radius: 50%;

        }

        

        .radio-option:has(input:focus) {

          outline: 3px solid #667eea;

          outline-offset: 2px;

        }

        

        .radio-label {

          display: flex;

          flex-direction: column;

          gap: 4px;

        }

        

        .radio-description {

          font-size: 13px;

          color: #6b7280;

        }

      `}</style>

    </fieldset>

  );

};

// ============================================

// ACCESSIBLE SLIDER (Mood Scale)

// ============================================

export const AccessibleSlider = ({

  label,

  value,

  onChange,

  min = 1,

  max = 10,

  step = 1,

  labels = {},

  required,

  className = ''

}) => {

  const id = useId();

  return (

    <div className={`slider-field ${className}`}>

      <label htmlFor={id} className={required ? 'required' : ''}>

        {label}

      </label>

      

      <div className="slider-container">

        <input

          type="range"

          id={id}

          min={min}

          max={max}

          step={step}

          value={value}

          onChange={(e) => onChange(parseInt(e.target.value, 10))}

          aria-valuemin={min}

          aria-valuemax={max}

          aria-valuenow={value}

          aria-valuetext={labels[value] || `${value} out of ${max}`}

        />

        

        <div className="slider-labels">

          <span>{labels[min] || min}</span>

          <span className="current-value">{value}</span>

          <span>{labels[max] || max}</span>

        </div>

      </div>

      <style jsx>{`

        .slider-field {

          margin-bottom: 20px;

        }

        

        label {

          display: block;

          font-weight: 500;

          margin-bottom: 12px;

          color: #374151;

        }

        

        .slider-container {

          padding: 8px 0;

        }

        

        input[type="range"] {

          width: 100%;

          height: 8px;

          border-radius: 4px;

          background: linear-gradient(to right, #dc2626 0%, #f59e0b 50%, #10b981 100%);

          outline: none;

          -webkit-appearance: none;

        }

        

        input[type="range"]::-webkit-slider-thumb {

          -webkit-appearance: none;

          width: 32px;

          height: 32px;

          border-radius: 50%;

          background: #667eea;

          cursor: pointer;

          border: 4px solid white;

          box-shadow: 0 2px 8px rgba(0,0,0,0.2);

        }

        

        input[type="range"]:focus::-webkit-slider-thumb {

          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3);

        }

        

        .slider-labels {

          display: flex;

          justify-content: space-between;

          margin-top: 8px;

          font-size: 14px;

          color: #6b7280;

        }

        

        .current-value {

          font-weight: 700;

          font-size: 18px;

          color: #667eea;

        }

      `}</style>

    </div>

  );

};

AccessibleInput.displayName = 'AccessibleInput';

AccessibleSelect.displayName = 'AccessibleSelect';
