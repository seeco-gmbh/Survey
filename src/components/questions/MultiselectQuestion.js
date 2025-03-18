import React from 'react';
import BaseQuestion, { isError } from './BaseQuestion';
import { t } from '../../localization';

const MultiselectQuestion = ({ 
  question, 
  shouldValidate = false,
  value = [], 
  onChange, 
  language 
}) => {
  const { hasError } = isError(question, value, shouldValidate, language);

  const handleMultiSelect = (option, checked) => {
    const newValue = checked 
      ? [...value, option]
      : value.filter(item => item !== option);
    
    onChange(question.id, newValue);
  };

  const getSelectionText = () => {
    const { minSelect, maxSelect } = question;
    
    const min = minSelect && maxSelect && minSelect > maxSelect ? maxSelect : minSelect;
    const max = maxSelect;
    
    if (min && max && min === max) {
      return t('selectExactly', language, { count: max }).replace('{count}', max);
    } else if (min && max) {
      return t('selectBetween', language, { min, max }).replace('{min}', min).replace('{max}', max);
    } else if (min) {
      return t('selectMin', language, { count: min }).replace('{min}', min);
    } else if (max) {
      return t('selectMax', language, { count: max }).replace('{max}', max);
    }
  };

  return (
    <BaseQuestion 
      question={{
        ...question,
        validation: {
          ...(question.validation || {}),
          minSelect: question.minSelect,
          maxSelect: question.maxSelect
        }
      }}
      shouldValidate={shouldValidate} 
      language={language} 
      value={value}
    >
      {(question.minSelect || question.maxSelect) && (
        <span className="text-gray-500 text-xs mb-2 block">{getSelectionText()}</span>
      )}
      <div className={`question-group-container ${(hasError) ? 'question-group-container-error' : ''}`}>
        {question.options.map((option) => {
          const isChecked = value.includes(option);
          const isDisabled = question.maxSelect && value.length >= question.maxSelect && !isChecked;
          
          return (
            <div key={option} className="checkbox-item">
              <input
                type="checkbox"
                className="checkbox-input "
                id={`${question.id}-${option}`}
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => handleMultiSelect(option, e.target.checked)}
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