import React from 'react';
import './App.css';
import InteractiveSurvey from './components/InteractiveSurvey';

function App() {
  return (
    <div className="container mx-auto py-8 px-4">
      <InteractiveSurvey language={"en"} />
    </div>
  );
}

export default App; 