import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const NumericQuestion = ({ 
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
      min: question.min !== undefined ? question.min : undefined,
      max: question.max !== undefined ? question.max : undefined,
      numeric: question.numeric !== undefined ? question.numeric : undefined
    }
  };

  if (questionWithValidation.validation.min === undefined) {
    delete questionWithValidation.validation.min;
  }
  if (questionWithValidation.validation.max === undefined) {
    delete questionWithValidation.validation.max;
  }
  
  const { hasError } = isError(questionWithValidation, value, shouldValidate, language);
  
  return (
    <BaseQuestion 
      question={questionWithValidation} 
      shouldValidate={shouldValidate} 
      language={language}
      value={value}
    >
      <input
        type="number"
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value === '' ? '' : Number(e.target.value))}
        min={question.min !== undefined ? question.min : undefined}
        max={question.max !== undefined ? question.max : undefined}
        step={question.step !== undefined ? question.step : 1}
        placeholder={question.placeholder || ''}
        aria-invalid={hasError}
      />
    </BaseQuestion>
  );
};

export default NumericQuestion; 