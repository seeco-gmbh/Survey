import React from 'react';
import { t } from '../localization';

const Section = ({ 
  section, 
  shouldShowQuestion, 
  renderQuestion, 
  validationError, 
  language 
}) => {

    return (
    <div className="survey-section">
      <h2 className="survey-section-title">{section.title}</h2>
      <p className="survey-section-description">{section.description}</p>

      <div className="survey-questions">
        {section.questions.map(question => renderQuestion(question))}
      </div>
      
      {validationError && (
        <div className="survey-validation-error">
          {t('validationError', language)}
        </div>
      )}
    </div>
    );
};

export default Section; 