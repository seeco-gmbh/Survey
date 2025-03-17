import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';

const MultiselectQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = [], 
  onChange, 
  language 
}) => {
  const { hasError } = isError(question, value, shouldValidate, language);
  
  const handleMultiSelect = (option, checked) => {
    if (checked) {
      onChange(question.id, [...value, option]);
    } else {
      onChange(question.id, value.filter(item => item !== option));
    }
  };

  return (
    <BaseQuestion 
      question={question} 
      shouldValidate={shouldValidate} 
      language={language} 
      value={value}
    >
      {question.maxSelect && (
        <span className="text-gray-500 text-xs mb-2 block">(max. {question.maxSelect})</span>
      )}
      <div className={`question-group-container ${hasError ? 'question-group-container-error' : ''}`}>
        {question.options.map((option) => {
          const isChecked = value.includes(option);
          const isDisabled = question.maxSelect && 
                          value.length >= question.maxSelect && 
                          !isChecked;
          
          return (
            <div key={option} className="checkbox-item">
              <input
                type="checkbox"
                id={`${question.id}-${option}`}
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => handleMultiSelect(option, e.target.checked)}
                className="checkbox-input"
              />
              <label 
                htmlFor={`${question.id}-${option}`} 
                className={isDisabled ? "checkbox-label-disabled" : "checkbox-label"}
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </BaseQuestion>
  );
};

export default MultiselectQuestion; 