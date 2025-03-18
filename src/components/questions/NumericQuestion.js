import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const NumericQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = '', 
  onChange, 
  language 
}) => {

  const { hasError } = isError(question, value, shouldValidate, language);
  
  const handleIncrement = () => {
    const currentValue = value === '' ? 0 : Number(value);
    const step = question.step || 1;
    const newValue = currentValue + step;
    
    // Check if the new value is within allowed max
    if (question.max !== undefined && newValue > question.max) {
      return;
    }
    
    onChange(question.id, newValue);
  };
  
  const handleDecrement = () => {
    const currentValue = value === '' ? 0 : Number(value);
    const step = question.step || 1;
    const newValue = currentValue - step;
    
    // Check if the new value is within allowed min
    if (question.min !== undefined && newValue < question.min) {
      return;
    }
    
    onChange(question.id, newValue);
  };
  
  return (
    <BaseQuestion 
      question={{
        ...question,
        validation: {
          ...(question.validation || {}),
          min: question.min,
          max: question.max,
          numeric: question.numeric
        }
      }} 
      shouldValidate={shouldValidate} 
      language={language}
      value={value}
    >
      <div className="number-input-wrapper">
        <input
          type="number"
          className={`question-field ${hasError ? 'question-field-error' : ''}`}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value === '' ? '' : Number(e.target.value))}
          step={question.step}
          min={question.min}
          max={question.max}
          placeholder={question.placeholder || ''}
          aria-invalid={hasError}
        />
        <div className="number-input-controls">
          <button 
            type="button"
            className="number-spinner-btn"
            onClick={handleIncrement}
            aria-label="Increase value"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button 
            type="button"
            className="number-spinner-btn"
            onClick={handleDecrement}
            aria-label="Decrease value"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </BaseQuestion>
  );
};

export default NumericQuestion; 