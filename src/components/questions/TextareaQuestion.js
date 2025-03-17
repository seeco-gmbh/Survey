import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const TextareaQuestion = ({ 
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
      <textarea
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
        placeholder={question.placeholder || ''}
        rows={question.rows || 4}
      />
    </BaseQuestion>
  );
};

export default TextareaQuestion; 