import { surveyData_de } from './surveyData_de';
import { surveyData_en } from './surveyData_en';
import { surveyData_es } from './surveyData_es';
import { surveyData_fr } from './surveyData_fr';
import { surveyData_it } from './surveyData_it';
import { surveyData_pt } from './surveyData_pt';

// Helper function to check if survey data is not empty
const isValidSurveyData = (data) => {
  return data && 
         Object.keys(data).length > 0 && 
         data.sections && 
         Array.isArray(data.sections) && 
         data.sections.length > 0;
};

// Build surveyData object with only non-empty data files
const buildSurveyData = () => {
  const data = {};
  
  if (isValidSurveyData(surveyData_de)) data.de = surveyData_de;
  if (isValidSurveyData(surveyData_en)) data.en = surveyData_en;
  if (isValidSurveyData(surveyData_es)) data.es = surveyData_es;
  if (isValidSurveyData(surveyData_fr)) data.fr = surveyData_fr;
  if (isValidSurveyData(surveyData_it)) data.it = surveyData_it;
  if (isValidSurveyData(surveyData_pt)) data.pt = surveyData_pt;
  
  return data;
};

// Export localized survey data
export const surveyData = buildSurveyData();

// Default language
export const defaultLanguage = 'en';

// Function to get survey data based on language
export const getSurveyData = (language = defaultLanguage) => {
  return surveyData[language] || surveyData[defaultLanguage];
};

// Function to get survey sections based on language
export const getSurveySections = (language = defaultLanguage) => {
  const data = surveyData[language] || surveyData[defaultLanguage];
  return data.sections || [];
};

// Function to get start screen data based on language
export const getStartScreenData = (language = defaultLanguage) => {
  const data = surveyData[language] || surveyData[defaultLanguage];
  return data.startScreen || {};
};

// Function to get result screen data based on language
export const getResultScreenData = (language = defaultLanguage) => {
  const data = surveyData[language] || surveyData[defaultLanguage];
  return data.resultScreen || {};
};