import React from 'react';
import { t } from '../localization';

const EndScreen = ({ 
  resultData, 
  language, 
  surveyId,
  renderHTML 
}) => {
  return (
    <div className="survey-results">
      <h2 className="survey-results-title">
        {resultData.title || t('thankYouTitle', language)}
      </h2>
      <p className="survey-results-description">
        {resultData.description || t('thankYouMessage', language)}
      </p>
      
      {resultData.bulletPoints && resultData.bulletPoints.length > 0 && (
        <ul className="survey-results-bullet-list">
          {resultData.bulletPoints.map((point, index) => (
            <li key={index} className="survey-results-bullet-item">{point}</li>
          ))}
        </ul>
      )}
      
      {resultData.bodyText && (
        <div 
          className="survey-results-body-text"
          dangerouslySetInnerHTML={renderHTML(resultData.bodyText)}
        />
      )}
      
      <div className="survey-results-confirmation">
        <div className="survey-confirmation-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="survey-confirmation-message">
          {resultData.description || t('thankYouMessage', language)}
        </p>
        <p className="survey-confirmation-id">
          {t('surveyIdLabel', language)} <span className="survey-id">{surveyId}</span>
        </p>
        
        {resultData.contactInfo && (
          <p className="survey-contact-info">{resultData.contactInfo}</p>
        )}
      </div>
      
      {resultData.ctaText && (
        <button 
          onClick={() => window.close()} 
          className="survey-button survey-button-secondary"
        >
          {resultData.ctaText}
        </button>
      )}
    </div>
  );
};

export default EndScreen; 