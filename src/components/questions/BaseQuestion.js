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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const iconRef = useRef(null);
  
  const { hasError, errorMessage } = isError(question, value, shouldValidate, language);
  
  const labelClass = hasError ? "question-label question-label-error" : "question-label";
  
  const calculateTooltipPosition = () => {
    if (!iconRef.current || !tooltipRef.current) return;

    const iconRect = iconRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Start with position below the icon
    let top = iconRect.bottom + 8;
    let left = iconRect.left;

    // Check if tooltip would go off the right edge
    if (left + tooltipRect.width > viewportWidth - 16) {
      left = viewportWidth - tooltipRect.width - 16;
    }

    // Check if tooltip would go off the left edge
    if (left < 16) {
      left = 16;
    }

    // If tooltip would go off the bottom, position it above the icon
    if (top + tooltipRect.height > viewportHeight - 16) {
      top = iconRect.top - tooltipRect.height - 8;
    }

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (showTooltip && info) {
      calculateTooltipPosition();
      // Recalculate position on window resize
      window.addEventListener('resize', calculateTooltipPosition);
      // Recalculate position on scroll
      window.addEventListener('scroll', calculateTooltipPosition);

      return () => {
        window.removeEventListener('resize', calculateTooltipPosition);
        window.removeEventListener('scroll', calculateTooltipPosition);
      };
    }
  }, [showTooltip, info]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) && 
          iconRef.current && !iconRef.current.contains(event.target)) {
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
    <span className="info-icon" ref={iconRef}>
      <span 
        className="info-icon-button"
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label={showTooltip ? t('hideInfo', language) : t('showInfo', language)}
      >
        i
      </span>
      {showTooltip && (
        <span 
          ref={tooltipRef}
          className="info-tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
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
