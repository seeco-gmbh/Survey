import React from 'react';
import { t, languages, defaultLanguage } from '../localization';
import { getSurveyData, getStartScreenData, getResultScreenData } from '../data/surveyData';
import { getQuestionComponentByType } from './questions';
import { validateField } from '../utils/validation';

const STORAGE_KEYS = {
  SURVEY_RESPONSES: 'surveyResponses',
  LAST_SURVEY_ID: 'lastSurveyId'
};

// Helper functions
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

  // Change language and update survey data
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

  // Proceed after language selection
  proceedWithLanguage = () => {
    this.setState({ languageSelected: true });
  }

  // Save answer and trigger validation
  saveAnswer = (questionId, value) => {
    this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [questionId]: value,
        [`${questionId}_modified`]: true
      }
    }), () => {
      // Only validate immediately if there was already a validation error
      // or if this field was previously marked as invalid
      if (this.state.validationError || this.state.missingFields.includes(questionId)) {
        const question = this.getCurrentQuestionById(questionId);
        if (question) {
          const validationRules = {
            ...(question.validation || {}),
            required: question.required
          };
          const { isValid } = validateField(value, validationRules);
          
          // Update missingFields based on validation result
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

  // Helper to get current question by ID
  getCurrentQuestionById = (questionId) => {
    const currentSection = this.state.surveyData[this.state.currentSection];
    return currentSection?.questions.find(q => q.id === questionId);
  };

  // Handle multiple answers for multiselect questions
  handleMultiSelect = (questionId, option, checked) => {
    const currentSelections = this.state.answers[questionId] || [];
    
    if (checked) {
      this.saveAnswer(questionId, [...currentSelections, option]);
    } else {
      this.saveAnswer(questionId, currentSelections.filter(item => item !== option));
    }
  };

  // Handle ranking updates - always mark as user action
  handleRankingChange = (questionId, newOrder) => {
    this.saveAnswer(questionId, newOrder, true);
  };

  // Navigate to next section or submit if on last section
  nextSection = () => {
    // Validate required fields
    if (!this.validateRequiredFields()) {
      return;
    }
    
    // If not the last section, go to next section
    if (this.state.currentSection < this.state.surveyData.length - 1) {
      // Scroll to top after state update
      const nextSection = this.state.currentSection + 1;
      this.setState({
        currentSection: nextSection,
        validationError: false,
        missingFields: [],
        progress: calculateProgress(nextSection, this.state.surveyData.length)
      }, () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      // If last section, submit the form
      this.handleSubmit();
    }
  };

  // Navigate to previous section
  prevSection = () => {
    const prevSection = this.state.currentSection - 1;
    this.setState({
      currentSection: prevSection,
      validationError: false,
      missingFields: [],
      progress: calculateProgress(prevSection, this.state.surveyData.length)
    }, () => {
      // Scroll to top after state update
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // Validate required fields in current section
  validateRequiredFields = () => {
    const currentSectionQuestions = this.state.surveyData[this.state.currentSection].questions;
    const missingFields = [];
    
    const requiredQuestions = currentSectionQuestions.filter(q => q.required && this.shouldShowQuestion(q));
    
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

  // Save to JSONBin
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

  // Submit survey
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

  // Check if a question should be displayed based on conditional logic
  shouldShowQuestion = (question) => {
    if (!question.condition) return true;
    
    const { dependsOn, value } = question.condition;
    const answer = this.state.answers[dependsOn];
    
    // If answer is undefined, the condition is not met
    if (answer === undefined) return false;
    
    // Handle array values (for multiselect)
    if (Array.isArray(answer)) {
      // If value is also an array, check if any value matches
      if (Array.isArray(value)) {
        return value.some(v => answer.includes(v));
      }
      // If value is a string, check if it's included in the answer array
      return answer.includes(value);
    }
    
    // Handle boolean values (for checkbox)
    if (typeof answer === 'boolean') {
      return answer === value;
    }
    
    // Handle function conditions
    if (typeof value === 'function') {
      return value(answer);
    }
    
    // Default case: direct comparison
    return answer === value;
  };

  // Render function for question types
  renderQuestion = (question) => {
    if (!this.shouldShowQuestion(question)) return null;
    
    const QuestionComponent = getQuestionComponentByType(question.type);
    if (!QuestionComponent) return null;
    
    const shouldValidate = this.state.validationError && this.state.missingFields.includes(question.id);
    
    return (
      <div key={question.id} className="mb-6">
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

   // Render start screen
   renderStartScreen = () => {
    const startData = this.state.startScreenData;
    
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[600px] p-3 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            {startData.title || t('welcomeToSurvey', this.state.language)}
          </h1>
          
          {startData.description && (
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl mx-auto text-gray-600 leading-relaxed">
              {startData.description}
            </p>
          )}

          <div className="mb-6 sm:mb-8 text-center">
            <p className="text-base mb-3 sm:mb-4 text-gray-700">{t('pleaseSelectLanguage', this.state.language)}</p>
            
            <div className="relative inline-block w-full sm:w-64 max-w-xs">
              <select
                value={this.state.language}
                onChange={(e) => this.changeLanguage(e.target.value)}
                className="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code} className="py-1">
                    {name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {startData.bulletPoints && startData.bulletPoints.length > 0 && (
            <ul className="mb-6 sm:mb-8 space-y-3 max-w-xl mx-auto px-2">
              {startData.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          {startData.bodyText && (
            <div 
              className="mb-6 sm:mb-8 text-gray-700 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={renderHTML(startData.bodyText)}
            />
          )}
          
          <div className="text-center">
            <button
              onClick={this.proceedWithLanguage}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {startData.ctaText || t('proceedToSurvey', this.state.language)}
              <svg className="ml-2 -mr-1 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
    );
  }

  // Render the current section of the survey
  renderCurrentSection = () => {
    if (!this.state.surveyData || !Array.isArray(this.state.surveyData) || !this.state.surveyData[this.state.currentSection]) {
      return <div><p>Loading section data...</p></div>;
    }
    
    const section = this.state.surveyData[this.state.currentSection];
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{section.title}</h2>
        <p className="text-gray-600 mb-8">{section.description}</p>

        <div className="space-y-8">
          {section.questions.map(question => this.renderQuestion(question))}
        </div>
        
        {this.state.validationError && (
          <div className="mt-8 p-4 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
            {t('validationError', this.state.language)}
          </div>
        )}
      
      </div>
    );
  };

  renderResults = () => {
    const resultData = this.state.resultScreenData;
    
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{resultData.title || t('thankYouTitle', this.state.language)}</h2>
        <p className="mb-6">{resultData.description || t('thankYouMessage', this.state.language)}</p>
        
        {resultData.bulletPoints && resultData.bulletPoints.length > 0 && (
          <ul className="mb-6 list-disc list-inside text-left max-w-md mx-auto">
            {resultData.bulletPoints.map((point, index) => (
              <li key={index} className="mb-2">{point}</li>
            ))}
          </ul>
        )}
        
        {resultData.bodyText && (
          <div 
            className="mb-6 text-gray-700 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={renderHTML(resultData.bodyText)}
          />
        )}
        
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-800">
            {resultData.description || t('thankYouMessage', this.state.language)}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {t('surveyIdLabel', this.state.language)} <span className="font-mono bg-gray-100 px-2 py-1 rounded">{this.state.surveyId}</span>
          </p>
          
          {resultData.contactInfo && (
            <p className="mt-4 text-sm text-gray-600">{resultData.contactInfo}</p>
          )}
        </div>
        
        {resultData.ctaText && (
          <button 
            onClick={() => window.close()} 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {resultData.ctaText}
          </button>
        )}
      </div>
    );
  };

  // Render progress bar
  renderProgressBar = () => (
    <div className="mb-8">
      <div className="bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${this.state.progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{t('startLabel', this.state.language)}</span>
        <span>{this.state.progress}{t('progressLabel', this.state.language)}</span>
      </div>
    </div>
  );

  // Render navigation buttons
  renderNavigationButtons = () => (
    <div className="flex justify-between mt-8">
      {this.state.currentSection > 0 ? (
        <button
          type="button"
          onClick={this.prevSection}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {t('prevButton', this.state.language)}
        </button>
      ) : (
        <div></div> /* Empty div to maintain flex spacing */
      )}
      
      {this.state.currentSection < this.state.surveyData.length - 1 ? (
        <button
          type="button"
          onClick={this.nextSection}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('nextButton', this.state.language)}
        </button>
      ) : (
        <button
          type="button"
          onClick={this.handleSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {t('submitButton', this.state.language)}
        </button>
      )}
    </div>
  );

  // Add animation keyframes to the head of the document
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
  }

  render() {
    if (!this.state.surveyData || !Array.isArray(this.state.surveyData)) {
      return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow">
          <p>Loading survey data...</p>
        </div>
      );
    }
    
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow">
        {!this.state.languageSelected ? (
          this.renderStartScreen()
        ) : !this.state.submitted ? (
         
          <>
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
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