import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';
import { t } from '../../localization';

const SelectQuestion = ({ 
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
      <select
        className={`question-field ${hasError ? 'question-field-error' : ''}`}
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
      >
        <option value="">{t('selectPlaceholder', language)}</option>
        {question.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </BaseQuestion>
  );
};

export default SelectQuestion; 