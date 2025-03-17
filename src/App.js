import React from 'react';
import './App.css';
import InteractiveSurvey from './components/InteractiveSurvey';
import { defaultLanguage } from './localization';

function App() {
  console.log('App - Default Language:', defaultLanguage);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <InteractiveSurvey language={defaultLanguage} />
    </div>
  );
}

export default App; 