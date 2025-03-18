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
      <input
        type="number"
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value === '' ? '' : Number(e.target.value))}
        step={question.step}
        placeholder={question.placeholder || ''}
        aria-invalid={hasError}
      />
    </BaseQuestion>
  );
};

export default NumericQuestion; 