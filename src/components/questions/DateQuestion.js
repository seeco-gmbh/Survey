import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const DateQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = '', 
  onChange, 
  language 
}) => {
  const questionWithValidation = {
    ...question,
    validation: {
      ...(question.validation || {}),
      minDate: question.minDate,
      maxDate: question.maxDate
    }
  };

  const { hasError } = isError(questionWithValidation, value, shouldValidate, language);
  
  return (
    <BaseQuestion 
      question={questionWithValidation} 
      shouldValidate={shouldValidate} 
      language={language} 
      value={value}
    >
      <input
        type="date"
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
        min={question.minDate || undefined}
        max={question.maxDate || undefined}
      />
    </BaseQuestion>
  );
};

export default DateQuestion; 