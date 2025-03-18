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
  
  const isEffectivelyEmpty = isDefaultValue && !userInteracted;
  
  const { hasError } = isError(
    question, 
    isEffectivelyEmpty ? null : currentValue, 
    shouldValidate, 
    language
  );
  
  const calculateStepSize = () => {
    if (question.marks) {
      return 1;
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
    if (!question.marks) {
      return (
        <div className="slider-marks" style={{ height: '30px' }}>
          <div
            className="slider-mark text-left"
            style={{ 
              left: '0%',
              transform: 'translateX(0)',
              width: 'auto'
            }}
          >
            <span className={`slider-mark-value ${hasError ? 'text-red-600' : ''}`}>
              {(question.min || 0)}{unit}
            </span>
          </div>
          <div
            className="slider-mark text-right"
            style={{ 
              left: '100%',
              transform: 'translateX(-100%)',
              width: 'auto',
            }}
          >
            <span className={`slider-mark-value ${hasError ? 'text-red-600' : ''}`}>
              {(question.max || 100)}{unit}
            </span>
          </div>
        </div>
      );
    }

    const markEntries = Object.entries(question.marks);
    
    return (
      <div className="slider-marks">
        {markEntries.map(([markValue, label], index) => {
          const position = (index / (markEntries.length - 1)) * 100;

          let translateX = "-50%";
          let textAlignment = "center";
          let width = 100 / markEntries.length + "%";

          if (index === 0) {
            textAlignment = "left";
            translateX = "0%";
          } else if (index === markEntries.length - 1) {
            textAlignment = "right";
            translateX = "-100%";
          } else {
            if(index > Math.floor(markEntries.length / 2)) {
              translateX = "-55%";
            } else if (index < Math.floor(markEntries.length / 2)) {
              translateX = "-45%";
            }
          }

          return (
            <div
              key={`mark-${markValue}`}
              className={`slider-mark ${textAlignment} ${hasError ? 'error' : ''}`}
              style={{ 
                left: `${position}%`,
                transform: `translateX(${translateX})`,
                width: width,
                textAlign: textAlignment
              }}
            >
              <span className="slider-mark-value">
                {markValue}
              </span>
              <span className="slider-mark-label">
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
          min={question.marks ? Math.min(...Object.keys(question.marks).map(Number)) : (question.min || 0)}
          max={question.marks ? Math.max(...Object.keys(question.marks).map(Number)) : (question.max || 100)}
          step={calculateStepSize()}
          value={currentValue}
          onChange={handleSliderChange}
          aria-invalid={hasError}
          data-testid={`slider-${question.id}`}
          style={{
            accentColor: hasError ? '#ef4444' : '',
          }}
        />

        {renderMarksAsColumns()}
      </div>
    </BaseQuestion>
  );
};

export default SliderQuestion;