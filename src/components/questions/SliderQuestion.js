import React, { useEffect, useState, useRef } from 'react';
import BaseQuestion, { isError } from './BaseQuestion';
import { t } from '../../localization';

const SliderQuestion = ({ 
  question, 
  shouldValidate = false, 
  value, 
  onChange, 
  language
}) => {
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentValue, setCurrentValue] = useState(value !== undefined ? value : (question.min || 0));
  const sliderRef = useRef(null);
  const isDefaultValue = currentValue === (question.min || 0);
  
  // Check if the slider should be considered "empty" for validation purposes
  const isEffectivelyEmpty = isDefaultValue && !userInteracted;
  
  // Use the standard required validation, but consider default value as empty if not interacted with
  const { hasError } = isError(
    question, 
    isEffectivelyEmpty ? null : currentValue, 
    shouldValidate, 
    language
  );
  
  const calculateStepSize = () => {
    if (question.marks) {
      const markEntries = Object.entries(question.marks);
      return 100 / (markEntries.length - 1);
    }
    return question.step || 1;
  };
  
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
      if (value !== (question.min || 0)) {
        setUserInteracted(true);
      }
    }
  }, [value, question.min]);
  
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setCurrentValue(newValue);
    setUserInteracted(true);
    onChange(question.id, newValue);
  };

  const renderMarksAsColumns = () => {
    if (!question.marks) return null;
    
    const markEntries = Object.entries(question.marks);

    return (
      <div className="slider-marks">
        {markEntries.map(([markValue, label], index) => {
          const position = (index / (markEntries.length - 1)) * 100;
          
          let textAlignment = "text-center";
          let translateX = `-50%`;
          if (index > Math.floor(markEntries.length / 2)) {
            translateX = `-60%`;
          } else if (index < Math.floor(markEntries.length / 2)) {
            translateX = `-40%`;
          }
          
          if (index === 0) {
            textAlignment = "text-left";
            translateX = '5%';
          } else if (index === markEntries.length - 1) {
            textAlignment = "text-right";
            translateX = '-105%';
          }

          return (
            <div
              key={`mark-${markValue}`}
              className={`slider-mark ${textAlignment}`}
              style={{ 
                left: `${position}%`,
                transform: `translateX(${translateX})`,
                width: '60px'
              }}
            >
              <span className={`slider-mark-value ${hasError ? 'text-red-600' : ''}`}>
                {markValue}
              </span>
              <span className={`slider-mark-label ${hasError ? 'text-red-600' : ''}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  const unit = question.unit || '';
  
  return (
    <BaseQuestion 
      question={question} 
      shouldValidate={shouldValidate} 
      language={language}
      value={isEffectivelyEmpty ? null : currentValue}
      customErrorMessage={hasError && isEffectivelyEmpty ? t('validationSlider', language) : null}
    >
      <div className="slider-container">
        {!question.marks && (
          <div className="flex justify-between">
            <span className={`text-lg font-medium ${hasError ? 'text-red-600' : ''}`}>
              {currentValue}{unit}
            </span>
          </div>
        )}
        
        <input
          ref={sliderRef}
          type="range"
          className={`slider-input ${hasError ? 'slider-input-error' : ''}`}
          min={question.min || 0}
          max={question.max || 100}
          step={calculateStepSize()}
          value={currentValue}
          onChange={handleSliderChange}
          aria-invalid={hasError}
          data-testid={`slider-${question.id}`}
          style={{
            accentColor: hasError ? '#ef4444' : '',
          }}
        />
        
        {!question.marks && (
          <div className="flex justify-between">
            <span className={`text-xs ${hasError ? 'text-red-600' : 'text-gray-600'}`}>
              {question.min || 0}{unit}
            </span>
            <span className={`text-xs ${hasError ? 'text-red-600' : 'text-gray-600'}`}>
              {question.max || 100}{unit}
            </span>
          </div>
        )}
        
        {question.marks && renderMarksAsColumns()}
      </div>
    </BaseQuestion>
  );
};

export default SliderQuestion;