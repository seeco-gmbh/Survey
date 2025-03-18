import React, { useState, useEffect, useRef } from 'react';
import BaseQuestion, { isError } from './BaseQuestion';
import { t } from '../../localization';

const DragIndicator = ({ position, isDragging, dragPosition, setDragPosition, handleReordering }) => (
  <div 
    className={`drag-indicator ${isDragging && dragPosition === position ? 'drag-indicator-active' : ''}`}
    style={{ 
      opacity: isDragging && dragPosition === position ? 1 : 0,
      visibility: isDragging && dragPosition === position ? 'visible' : 'hidden',
    }}
    onDragOver={(e) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setDragPosition(position);
    }}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isDragging) return;
      
      const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
      if (isNaN(sourceIndex)) return;
      
      handleReordering(sourceIndex, position);
    }}
  />
);

const DragHandle = () => (
  <div className="ranked-handle">
    <div className="w-4 h-0.5 bg-current mb-1"></div>
    <div className="w-4 h-0.5 bg-current mb-1"></div>
    <div className="w-4 h-0.5 bg-current"></div>
  </div>
);

const RankedQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = [], 
  onChange, 
  language, 
  isModified = false
}) => {
  const questionId = useRef(`ranked-question-${question.id}`);
  const [ranking, setRanking] = useState(value.length ? value : [...question.options]);
  const [dragPosition, setDragPosition] = useState(-1);
  const [draggedItem, setDraggedItem] = useState(-1);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenModified, setHasBeenModified] = useState(isModified);
  
  const effectiveValue = hasBeenModified ? ranking : null;
  
  const { hasError } = isError(question, effectiveValue, shouldValidate, language);
  
  useEffect(() => {
    if (value.length && JSON.stringify(value) !== JSON.stringify(ranking)) {
      setRanking(value);
    } else if (question.options.length && !value.length && JSON.stringify(question.options) !== JSON.stringify(ranking)) {
      setRanking([...question.options]);
    }
  }, [value, question.options, ranking]);

  const handleReordering = (sourceIndex, targetPosition) => {
    if (sourceIndex === targetPosition || 
        (sourceIndex === targetPosition - 1 && targetPosition > 0)) {
      return false;
    }
    
    const newRanking = [...ranking];
    const [movedItem] = newRanking.splice(sourceIndex, 1);
    
    let targetIndex = targetPosition;
    if (sourceIndex < targetPosition) {
      targetIndex--;
    }
    
    newRanking.splice(targetIndex, 0, movedItem);
    
    setRanking(newRanking);
    onChange(question.id, newRanking, true);
    setHasBeenModified(true);
    resetDragStates();
    return true;
  };

  const resetDragStates = () => {
    setDragPosition(-1);
    setDraggedItem(-1);
    setIsDragging(false);
  };

  // Check if mouse is in top or bottom half of element
  const checkItemHoverPosition = (e, index) => {
    if (!isDragging || draggedItem === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const middleY = rect.top + rect.height / 2;
    
    // If mouse is in top half of the element
    if (mouseY < middleY) {
      setDragPosition(index);
    } else {
      // If mouse is in bottom half of the element
      setDragPosition(index + 1);
    }
  };

  useEffect(() => {
    const handleDragOver = (e) => {
      if (!isDragging) return;
      
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
      }
    };
    
    const handleDrop = () => {
      resetDragStates();
    };
    
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isDragging]);

  return (
    <BaseQuestion 
      question={question} 
      shouldValidate={shouldValidate} 
      language={language}
      value={effectiveValue}
      customErrorMessage={hasError && !hasBeenModified ? t('validationRanked', language) : null}
    >
      <div 
        ref={containerRef}
        className={`question-group-container ${hasError ? 'question-group-container-error' : ''}`}
        onDragOver={(e) => {
          if (!isDragging) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const firstItemTop = containerRect.top + 20;
          
          if (e.clientY < firstItemTop) {
            setDragPosition(0);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          
          if (!isDragging) return;
          
          const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
          if (!isNaN(sourceIndex) && dragPosition >= 0) {
            handleReordering(sourceIndex, dragPosition);
          }
          
          resetDragStates();
        }}
        aria-invalid={hasError}
      >
        <ul className="ranked-list">
          <DragIndicator 
            position={0}
            isDragging={isDragging}
            dragPosition={dragPosition}
            setDragPosition={setDragPosition}
            handleReordering={handleReordering}
          />
          
          {ranking.map((item, index) => (
            <li key={item}>
              <div 
                className={`ranked-item ${
                  draggedItem === index ? 'opacity-50' : ''
                } ${dragPosition === index ? 'border-blue-400' : ''} ${
                  isDragging ? 'ranked-item-dragging' : ''
                }`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('sourceIndex', index.toString());
                  e.dataTransfer.setData('questionId', questionId.current);
                  e.dataTransfer.effectAllowed = 'move';                 
                  e.dataTransfer.setDragImage(
                    e.currentTarget, 
                    e.currentTarget.offsetWidth / 2, 
                    e.currentTarget.offsetHeight / 2
                  );
                  
                  setIsDragging(true);
                  setDraggedItem(index);
                  if (!hasBeenModified) {
                    setHasBeenModified(true);
                    onChange(question.id, ranking, true);
                  }
                }}
                onDragEnd={resetDragStates}
                onDragOver={(e) => {
                  if (!isDragging || draggedItem === index) return;
                  e.preventDefault();
                  e.stopPropagation();
                  checkItemHoverPosition(e, index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!isDragging) return;
                  
                  const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
                  if (!isNaN(sourceIndex)) {
                    const targetPosition = e.clientY < e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2
                      ? index
                      : index + 1;
                    handleReordering(sourceIndex, targetPosition);
                  }
                }}
              >
                <div className="ranked-number">{index + 1}</div>
                <DragHandle />
                <span className="flex-grow">{item}</span>
              </div>
              
              <DragIndicator 
                position={index + 1}
                isDragging={isDragging}
                dragPosition={dragPosition}
                setDragPosition={setDragPosition}
                handleReordering={handleReordering}
              />
            </li>
          ))}
        </ul>
      </div>
    </BaseQuestion>
  );
};

export default RankedQuestion; 