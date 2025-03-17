import TextQuestion from './TextQuestion';
import TextareaQuestion from './TextareaQuestion';
import SelectQuestion from './SelectQuestion';
import MultiselectQuestion from './MultiselectQuestion';
import SliderQuestion from './SliderQuestion';
import NumberQuestion from './NumericQuestion';
import DateQuestion from './DateQuestion';
import RankedQuestion from './RankedQuestion';
import BaseQuestion from './BaseQuestion';

export {
  TextQuestion,
  TextareaQuestion,
  SelectQuestion,
  MultiselectQuestion,
  SliderQuestion,
  NumberQuestion,
  DateQuestion,
  RankedQuestion,
  BaseQuestion
};

export const getQuestionComponentByType = (type) => {
  switch (type) {
    case 'text': return TextQuestion;
    case 'textarea': return TextareaQuestion;
    case 'select': return SelectQuestion;
    case 'multiselect': return MultiselectQuestion;
    case 'range_slider': return SliderQuestion;
    case 'marks_slider': return SliderQuestion;
    case 'number': return NumberQuestion;
    case 'date': return DateQuestion;
    case 'ranked': return RankedQuestion;
    default: return null;
  }
}; 