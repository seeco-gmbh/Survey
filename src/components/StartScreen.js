import React from 'react';
import { t, languages } from '../localization';

const StartScreen = ({ 
  startData, 
  language, 
  changeLanguage, 
  proceedWithLanguage,
  renderHTML 
}) => {
  return (
    <div className="survey-start-screen">
      <h1 className="survey-title">
        {startData.title || t('welcomeToSurvey', language)}
      </h1>
      
      {startData.description && (
        <p className="survey-description">
          {startData.description}
        </p>
      )}

      <div className="survey-language-selector">
        <p className="survey-language-prompt">{t('pleaseSelectLanguage', language)}</p>
        
        <div className="select-wrapper">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="survey-select"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <div className="select-arrow">
            <svg className="select-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {startData.bulletPoints && startData.bulletPoints.length > 0 && (
        <ul className="survey-bullet-list">
          {startData.bulletPoints.map((point, index) => (
            <li key={index} className="survey-bullet-item">
              <svg className="survey-bullet-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      
      {startData.bodyText && (
        <div 
          className="survey-body-text"
          dangerouslySetInnerHTML={renderHTML(startData.bodyText)}
        />
      )}
      
      <div className="survey-start-cta">
        <button
          onClick={proceedWithLanguage}
          className="survey-button survey-button-primary"
        >
          {startData.ctaText || t('proceedToSurvey', language)}
          <svg className="survey-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        
        <p className="survey-anonymity-note">
          {startData.anonymityNote}
        </p>
      </div>
    </div>
  );
};

export default StartScreen; 