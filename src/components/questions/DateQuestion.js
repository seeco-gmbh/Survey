import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const DateQuestion = ({ 
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
          minDate: question.minDate,
          maxDate: question.maxDate
        }
      }} 
      shouldValidate={shouldValidate} 
      language={language} 
      value={value}
    >
      <input
        type="date"
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
      />
    </BaseQuestion>
  );
};

export default DateQuestion; 