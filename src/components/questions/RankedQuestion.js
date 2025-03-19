import React, { useState, useEffect, useRef } from 'react';
import BaseQuestion, { isError } from './BaseQuestion';
import { t } from '../../localization';

const DragHandle = () => <div className="ranked-handle" />;

const RankedQuestion = ({ 
  question, 
  shouldValidate = false, 
  value = [], 
  onChange, 
  language, 
  isModified = false
}) => {
  const containerRef = useRef(null);
  const [ranking, setRanking] = useState(value.length ? value : [...question.options]);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedIndex: -1,
    dropTargetIndex: -1
  });
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

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleDragOver = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
      }
    };
    
    const handleDrop = () => resetDragState();
    
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [dragState.isDragging]);

  const resetDragState = () => {
    setDragState({
      isDragging: false,
      draggedIndex: -1,
      dropTargetIndex: -1
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('sourceIndex', index.toString());
    e.dataTransfer.effectAllowed = 'move';                 
    e.dataTransfer.setDragImage(
      e.currentTarget, 
      e.currentTarget.offsetWidth / 2, 
      e.currentTarget.offsetHeight / 2
    );
    
    setDragState({
      isDragging: true,
      draggedIndex: index,
      dropTargetIndex: -1
    });
    
    if (!hasBeenModified) {
      setHasBeenModified(true);
      onChange(question.id, ranking, true);
    }
  };

  const updateDropTarget = (index, isAbove = true) => {
    setDragState(prev => ({
      ...prev,
      dropTargetIndex: isAbove ? index : index + 1
    }));
  };

  const handleReordering = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || 
        (sourceIndex === targetIndex - 1 && targetIndex > 0)) {
      return false;
    }
    
    const newRanking = [...ranking];
    const [movedItem] = newRanking.splice(sourceIndex, 1);
    
    let adjustedTargetIndex = targetIndex;
    if (sourceIndex < targetIndex) {
      adjustedTargetIndex--;
    }
    
    newRanking.splice(adjustedTargetIndex, 0, movedItem);
    
    setRanking(newRanking);
    onChange(question.id, newRanking, true);
    setHasBeenModified(true);
    resetDragState();
    return true;
  };

  const handleContainerDragOver = (e) => {
    if (!dragState.isDragging) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const isTopArea = e.clientY < containerRect.top + 20;
    
    if (isTopArea) {
      updateDropTarget(0);
    }
  };

  const handleItemDragOver = (e, index) => {
    if (!dragState.isDragging || dragState.draggedIndex === index) return;
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY < rect.top + rect.height / 2;
    updateDropTarget(index, isTopHalf);
  };

  const handleDrop = (e, index = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragState.isDragging) return;
    
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
    if (isNaN(sourceIndex)) return;
    
    let targetIndex = index !== null 
      ? (e.clientY < e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2
        ? index : index + 1)
      : dragState.dropTargetIndex;
      
    if (targetIndex >= 0) {
      handleReordering(sourceIndex, targetIndex);
    }
    
    resetDragState();
  };

  const isDragTargetAt = (position) => 
    dragState.isDragging && dragState.dropTargetIndex === position;

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
        onDragOver={handleContainerDragOver}
        onDrop={handleDrop}
        aria-invalid={hasError}
      >
        <ul className="ranked-list">
          {/* Top indicator */}
          <div className={`drag-indicator ${isDragTargetAt(0) ? 'drag-indicator-active' : ''}`} />
          
          {ranking.map((item, index) => (
            <li key={item}>
              <div 
                className={`ranked-item ${dragState.draggedIndex === index ? 'opacity-50' : ''} 
                           ${isDragTargetAt(index) ? 'border-primary' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={resetDragState}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="ranked-number">{index + 1}</div>
                <DragHandle />
                <span className="flex-grow">{item}</span>
              </div>
              
              {/* Item drop indicator */}
              <div className={`drag-indicator ${isDragTargetAt(index + 1) ? 'drag-indicator-active' : ''}`} />
            </li>
          ))}
        </ul>
      </div>
    </BaseQuestion>
  );
};

export default RankedQuestion;