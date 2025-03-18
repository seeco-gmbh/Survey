import React from 'react';
import { t, languages, defaultLanguage } from '../localization';
import { getSurveyData, getStartScreenData, getResultScreenData } from '../data/surveyData';
import { getQuestionComponentByType } from './questions';
import { validateField } from '../utils/validation';

const STORAGE_KEYS = {
  SURVEY_RESPONSES: 'surveyResponses',
  LAST_SURVEY_ID: 'lastSurveyId'
};

const generateSurveyId = () => 'survey_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
const calculateProgress = (currentSection, totalSections) => Math.round((currentSection / (totalSections - 1)) * 100);

const renderHTML = (html) => {
  return { __html: html };
};

class InteractiveSurvey extends React.Component {
  constructor(props) {
    super(props);
    const language = props.language || defaultLanguage;
    const surveyData = getSurveyData(language);
    
    this.state = {
      currentSection: 0,
      answers: {},
      progress: 0,
      submitted: false,
      validationError: false,
      missingFields: [],
      surveyId: generateSurveyId(),
      language: language,
      surveyData: surveyData.sections || surveyData,
      startScreenData: getStartScreenData(language),
      resultScreenData: getResultScreenData(language),
      languageSelected: false
    };
  }

  changeLanguage = (language) => {
    if (languages[language]) {
      const surveyData = getSurveyData(language);
      this.setState({ 
        language,
        surveyData: surveyData.sections || surveyData,
        startScreenData: getStartScreenData(language),
        resultScreenData: getResultScreenData(language)
      });
    }
  }

  proceedWithLanguage = () => {
    this.setState({ languageSelected: true }, () => {
      this.checkAndSkipConditionalSections();
    });
  }

  saveAnswer = (questionId, value) => {
    this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [questionId]: value,
        [`${questionId}_modified`]: true
      }
    }), () => {
      if (this.state.validationError || this.state.missingFields.includes(questionId)) {
        const question = this.getCurrentQuestionById(questionId);
        if (question) {
          const validationRules = {
            ...(question.validation || {}),
            required: question.required
          };
          const { isValid } = validateField(value, validationRules);
          
          this.setState(prevState => {
            const newMissingFields = isValid 
              ? prevState.missingFields.filter(id => id !== questionId)
              : prevState.missingFields.includes(questionId) 
                ? prevState.missingFields 
                : [...prevState.missingFields, questionId];
                
            return {
              missingFields: newMissingFields,
              validationError: newMissingFields.length > 0
            };
          });
        }
      }
    });
  };

  getCurrentQuestionById = (questionId) => {
    const currentSection = this.state.surveyData[this.state.currentSection];
    return currentSection?.questions.find(q => q.id === questionId);
  };

  handleMultiSelect = (questionId, option, checked) => {
    const currentSelections = this.state.answers[questionId] || [];
    
    if (checked) {
      this.saveAnswer(questionId, [...currentSelections, option]);
    } else {
      this.saveAnswer(questionId, currentSelections.filter(item => item !== option));
    }
  };

  handleRankingChange = (questionId, newOrder) => {
    this.saveAnswer(questionId, newOrder, true);
  };

  shouldShowQuestion = (question) => {
    if (!question.condition) return true;
    
    const { dependsOn, value } = question.condition;
    const answer = this.state.answers[dependsOn];
    
    if (answer === undefined) return false;
    
    if (Array.isArray(answer)) {
      if (Array.isArray(value)) {
        return value.some(v => answer.includes(v));
      }
      return answer.includes(value);
    }
    
    if (typeof answer === 'boolean') {
      return answer === value;
    }
    
    if (typeof value === 'function') {
      return value(answer);
    }
    
    return answer === value;
  };

  shouldShowSection = (section) => {
    if (!section.condition) return true;
    
    const { dependsOn, value } = section.condition;
    const answer = this.state.answers[dependsOn];
    
    if (answer === undefined) return false;
    
    if (Array.isArray(answer)) {
      if (Array.isArray(value)) {
        return value.some(v => answer.includes(v));
      }
      return answer.includes(value);
    }
    
    if (typeof answer === 'boolean') {
      return answer === value;
    }
    
    if (typeof value === 'function') {
      return value(answer);
    }
    
    return answer === value;
  };

  nextSection = () => {
    if (!this.validateRequiredFields()) {
      return;
    }
    
    let nextSectionIndex = this.state.currentSection + 1;
    
    while (
      nextSectionIndex < this.state.surveyData.length && 
      !this.shouldShowSection(this.state.surveyData[nextSectionIndex])
    ) {
      nextSectionIndex++;
    }
    
    if (nextSectionIndex < this.state.surveyData.length) {
      this.setState({
        currentSection: nextSectionIndex,
        validationError: false,
        missingFields: [],
        progress: calculateProgress(nextSectionIndex, this.state.surveyData.length)
      }, () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      this.handleSubmit();
    }
  };
  
  prevSection = () => {
    let prevSectionIndex = this.state.currentSection - 1;
    
    while (
      prevSectionIndex >= 0 && 
      !this.shouldShowSection(this.state.surveyData[prevSectionIndex])
    ) {
      prevSectionIndex--;
    }
    
    if (prevSectionIndex >= 0) {
      this.setState({
        currentSection: prevSectionIndex,
        validationError: false,
        missingFields: [],
        progress: calculateProgress(prevSectionIndex, this.state.surveyData.length)
      }, () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  validateRequiredFields = () => {
    const currentSection = this.state.surveyData[this.state.currentSection];
    
    if (!this.shouldShowSection(currentSection)) {
      return true;
    }
    
    const currentSectionQuestions = currentSection.questions;
    const missingFields = [];
    
    const requiredQuestions = currentSectionQuestions.filter(
      q => q.required && this.shouldShowQuestion(q)
    );
    
    requiredQuestions.forEach(q => {
      const answer = this.state.answers[q.id];
      
      const validationRules = {
        ...(q.validation || {}),
        required: q.required
      };
      
      const { isValid } = validateField(answer, validationRules);
      
      if (!isValid) {
        missingFields.push(q.id);
      }
    });
    
    if (missingFields.length > 0) {
      this.setState({
        validationError: true,
        missingFields
      });
      return false;
    }
    
    this.setState({
      validationError: false,
      missingFields: []
    });
    return true;
  };

  saveToJsonBin = (data) => {
    fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Master-Key': '$APIKey',
        'X-Bin-Name': this.state.surveyId
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Saved to JSONBin:', data);
      localStorage.setItem('lastSurveyId', data.metadata.id);
    })
    .catch(error => {
      console.error('Error saving to JSONBin:', error);
      this.saveToLocalStorage(data);
    });
  };
  
  saveToLocalStorage = (data) => {
    try {
      const existingData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SURVEY_RESPONSES) || '[]');
      existingData.push({
        id: this.state.surveyId,
        timestamp: new Date().toISOString(),
        data: data
      });
      localStorage.setItem(STORAGE_KEYS.SURVEY_RESPONSES, JSON.stringify(existingData));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  handleSubmit = () => {
    const submissionData = {
      surveyId: this.state.surveyId,
      answers: this.state.answers,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    };
    
    this.saveToLocalStorage(submissionData);
    this.saveToJsonBin(submissionData);
    this.setState({ submitted: true });
  };

  renderQuestion = (question) => {
    if (!this.shouldShowQuestion(question)) return null;
    
    const QuestionComponent = getQuestionComponentByType(question.type);
    if (!QuestionComponent) return null;
    
    const shouldValidate = this.state.validationError && this.state.missingFields.includes(question.id);
    
    return (
      <div key={question.id} className="survey-question">
        <QuestionComponent
          question={question}
          shouldValidate={shouldValidate}
          value={this.state.answers[question.id]}
          onChange={this.saveAnswer}
          language={this.state.language}
        />
      </div>
    );
  };

   renderStartScreen = () => {
    const startData = this.state.startScreenData;
    
    return (
      <div className="survey-start-screen">
          <h1 className="survey-title">
            {startData.title || t('welcomeToSurvey', this.state.language)}
          </h1>
          
          {startData.description && (
            <p className="survey-description">
              {startData.description}
            </p>
          )}

          <div className="survey-language-selector">
            <p className="survey-language-prompt">{t('pleaseSelectLanguage', this.state.language)}</p>
            
            <div className="select-wrapper">
              <select
                value={this.state.language}
                onChange={(e) => this.changeLanguage(e.target.value)}
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
              onClick={this.proceedWithLanguage}
              className="survey-button survey-button-primary"
            >
              {startData.ctaText || t('proceedToSurvey', this.state.language)}
              <svg className="survey-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
    );
  }

  renderCurrentSection = () => {
    if (!this.state.surveyData || !Array.isArray(this.state.surveyData) || !this.state.surveyData[this.state.currentSection]) {
      return <div className="survey-loading"><p>Loading section data...</p></div>;
    }
    
    const section = this.state.surveyData[this.state.currentSection];
    
    if (!this.shouldShowSection(section)) {
      this.nextSection();
      return <div className="survey-loading"><p>Loading next section...</p></div>;
    }
    
    return (
      <div className="survey-section">
        <h2 className="survey-section-title">{section.title}</h2>
        <p className="survey-section-description">{section.description}</p>

        <div className="survey-questions">
          {section.questions.map(question => this.renderQuestion(question))}
        </div>
        
        {this.state.validationError && (
          <div className="survey-validation-error">
            {t('validationError', this.state.language)}
          </div>
        )}
      
      </div>
    );
  };

  renderResults = () => {
    const resultData = this.state.resultScreenData;
    
    return (
      <div className="survey-results">
        <h2 className="survey-results-title">{resultData.title || t('thankYouTitle', this.state.language)}</h2>
        <p className="survey-results-description">{resultData.description || t('thankYouMessage', this.state.language)}</p>
        
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
            {resultData.description || t('thankYouMessage', this.state.language)}
          </p>
          <p className="survey-confirmation-id">
            {t('surveyIdLabel', this.state.language)} <span className="survey-id">{this.state.surveyId}</span>
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

  renderProgressBar = () => (
    <div className="survey-progress">
      <div className="survey-progress-track">
        <div 
          className="survey-progress-bar"
          style={{ width: `${this.state.progress}%` }}
        ></div>
      </div>
      <div className="survey-progress-labels">
        <span>{t('startLabel', this.state.language)}</span>
        <span>{this.state.progress}{t('progressLabel', this.state.language)}</span>
      </div>
    </div>
  );

  renderNavigationButtons = () => (
    <div className="survey-navigation">
      {this.state.currentSection > 0 ? (
        <button
          type="button"
          onClick={this.prevSection}
          className="survey-button survey-button-secondary"
        >
          {t('prevButton', this.state.language)}
        </button>
      ) : (
        <div className="survey-button-placeholder"></div>
      )}
      
      {this.state.currentSection < this.state.surveyData.length - 1 ? (
        <button
          type="button"
          onClick={this.nextSection}
          className="survey-button survey-button-primary"
        >
          {t('nextButton', this.state.language)}
        </button>
      ) : (
        <button
          type="button"
          onClick={this.handleSubmit}
          className="survey-button survey-button-success"
        >
          {t('submitButton', this.state.language)}
        </button>
      )}
    </div>
  );

  componentDidMount() {
    if (!document.getElementById('survey-animations')) {
      const style = document.createElement('style');
      style.id = 'survey-animations';
      style.innerHTML = `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    if (this.state.languageSelected && this.state.surveyData && this.state.surveyData.length > 0) {
      this.checkAndSkipConditionalSections();
    }
  }

  checkAndSkipConditionalSections = () => {
    let sectionIndex = this.state.currentSection;
    
    if (this.state.surveyData[sectionIndex] && !this.shouldShowSection(this.state.surveyData[sectionIndex])) {
      while (
        sectionIndex < this.state.surveyData.length && 
        !this.shouldShowSection(this.state.surveyData[sectionIndex])
      ) {
        sectionIndex++;
      }
      
      if (sectionIndex < this.state.surveyData.length) {
        this.setState({
          currentSection: sectionIndex,
          progress: calculateProgress(sectionIndex, this.state.surveyData.length)
        });
      }
    }
  }

  render() {
    if (!this.state.surveyData || !Array.isArray(this.state.surveyData)) {
      return (
        <div className="survey-container survey-loading">
          <p>Loading survey data...</p>
        </div>
      );
    }
    
    return (
      <div className="survey-container">
        {!this.state.languageSelected ? (
          this.renderStartScreen()
        ) : !this.state.submitted ? (
         
          <>
            <h1 className="survey-main-title">
              {getSurveyData(this.state.language).title}
            </h1>
            {this.renderProgressBar()}
            {this.renderCurrentSection()}
            {this.renderNavigationButtons()}
          </>
        ) : (
          this.renderResults()
        )}
      </div>
    );
  }
}

export default InteractiveSurvey;