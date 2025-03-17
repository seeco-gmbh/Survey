import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const TextQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = '', 
  onChange, 
  language 
}) => {
  const { hasError } = isError(question, value, shouldValidate, language);
  
  return (
    <BaseQuestion 
      question={question} 
      shouldValidate={shouldValidate} 
      language={language}
      value={value}
    >
      <input
        type="text"
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
        placeholder={question.placeholder || ''}
      />
    </BaseQuestion>
  );
};

export default TextQuestion; 