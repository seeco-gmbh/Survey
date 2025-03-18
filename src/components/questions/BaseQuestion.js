import React, { useState, useRef, useEffect } from 'react';
import { t } from '../../localization';
import { validateField, getErrorMessage } from '../../utils/validation';

const BaseQuestion = ({ 
  question, 
  shouldValidate = false,
  children, 
  language,
  value,
  customErrorMessage,
}) => {
  const { id, label, required, info, hint } = question;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const tooltipRef = useRef(null);
  const textMeasureRef = useRef(null);
  
  const { hasError, errorMessage } = isError(question, value, shouldValidate, language);
  
  const labelClass = hasError ? "question-label question-label-error" : "question-label";
  
  useEffect(() => {
    if (showTooltip && info && textMeasureRef.current) {
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.fontSize = '0.875rem'; 
      span.style.padding = '0.75rem'; 
      span.textContent = info;
      document.body.appendChild(span);
      
      const textWidth = span.offsetWidth + 16;
      document.body.removeChild(span);
      
      setTooltipWidth(textWidth);
    }
  }, [showTooltip, info]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);
  
  const requiredMark = required ? <span className="required-mark">*</span> : null;
  
  const infoIcon = info ? (
    <span className="info-icon" ref={tooltipRef}>
      <span 
        className="info-icon-button"
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label={showTooltip ? t('hideInfo', language) : t('showInfo', language)}
      >
        i
      </span>
      {showTooltip && (
        <span 
          ref={textMeasureRef}
          style={{ width: `${tooltipWidth}px` }}
          className="info-tooltip"
        >
          {info}
        </span>
      )}
    </span>
  ) : null;

  const hintElement = hint ? (
    <p className="question-hint">{hint}</p>
  ) : null;

  const errorMessageElement = hasError ? (
    <p className="question-error">
      {customErrorMessage || errorMessage}
    </p>
  ) : null;

  return (
    <div className="question-container" key={id}>
      {label && (
        <label className={labelClass}>
          {label}
          {requiredMark}
          {infoIcon}
        </label>
      )}
      <div className="mt-2">
        {children}
      </div>
      {hintElement}
      {errorMessageElement}
    </div>
  );
};

export default BaseQuestion;

/**
 * Determines if a question has validation errors
 * @param {Object} question - The question object containing validation rules
 * @param {*} value - The current value of the question
 * @param {boolean} shouldValidate - Whether validation should be performed (e.g., form submitted)
 * @param {string} language - The language of the application
 * @returns {Object} - { hasError: boolean, errorMessage: string }
 */
export const isError = (question, value, shouldValidate = false, language) => {
  if (!shouldValidate || !question) return { hasError: false, errorMessage: null };
  
  const validationRules = {
    ...(question.validation || {}),
    required: question.required
  };
  
  const validationResult = validateField(value, validationRules);
  
  if (!validationResult.isValid) {
    const errorMessage = getErrorMessage(validationResult.errorType, language, validationResult.param);
    return { hasError: true, errorMessage };
  }
  
  return { hasError: false, errorMessage: null };
};
