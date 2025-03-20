import React from 'react';
import { t, languages, defaultLanguage } from '../localization';
import { getSurveyData, getStartScreenData, getResultScreenData } from '../data/surveyData';
import { getQuestionComponentByType } from './questions';
import { validateField } from '../utils/validation';
import ThemeToggle from './ThemeToggle';
import SurveySection from './Section';
import StartScreen from './StartScreen';
import EndScreen from './EndScreen';

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
    if (!process.env.REACT_APP_JSONBIN_API_KEY) {
      console.error('JSONBin API key is not set. Please check your .env file and restart the development server.');
      this.saveToLocalStorage(data);
      return;
    }

    fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Bin-Name': this.state.surveyId,
        'X-Master-Key': process.env.JSONBIN_API_KEY,
        'X-Collection-Id': process.env.JSONBIN_COLLECTION_ID,
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.message === 'Invalid X-Master-Key provided') {
        throw new Error('Invalid API key. Please check your .env file.');
      }
      console.log('Saved to JSONBin:', data);
      if (data.metadata && data.metadata.id) {
        localStorage.setItem('lastSurveyId', data.metadata.id);
      } else {
        throw new Error('Unexpected response format from JSONBin');
      }
    })
    .catch(error => {
      console.error('Error saving to JSONBin:', error.message);
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
    return (
        <StartScreen
          startData={this.state.startScreenData}
          language={this.state.language}
          changeLanguage={this.changeLanguage}
          proceedWithLanguage={this.proceedWithLanguage}
          renderHTML={renderHTML}
        />
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
      <SurveySection
        section={section}
        shouldShowQuestion={this.shouldShowQuestion}
        renderQuestion={this.renderQuestion}
        validationError={this.state.validationError}
        language={this.state.language}
      />
    );
  };

  renderResults = () => {
    return (
      <EndScreen
        resultData={this.state.resultScreenData}
        language={this.state.language}
        surveyId={this.state.surveyId}
        renderHTML={renderHTML}
      />
    );
  }

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
          <ThemeToggle />
          <p>Loading survey data...</p>
        </div>
      );
    }
    
    return (
      <div className="survey-container">
        {!this.state.languageSelected ? (
          <>
            <ThemeToggle />
            {this.renderStartScreen()}
          </>
        ) : !this.state.submitted ? (
          <>
            <ThemeToggle />
            <h1 className="survey-main-title">
              {getSurveyData(this.state.language).title}
            </h1>
            {this.renderProgressBar()}
            {this.renderCurrentSection()}
            {this.renderNavigationButtons()}
          </>
        ) : (
          <>
            <ThemeToggle />
            {this.renderResults()}
          </>
        )}
      </div>
    );
  }
}

export default InteractiveSurvey;