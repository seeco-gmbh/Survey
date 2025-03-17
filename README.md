# Dynamic Survey

This React application provides an interactive survey that is dynamically generated with survey data. 
Use the AI instructions below to generate survey data with an AI Assistant and paste it to the survey data file.

## Features

- Multi-page questionnaire with progress indicator
- Various question types (Text, Email, Textarea, Number, Date, Select, Multiple Select, Checkbox, Sliders, Ranking)
- Conditional logic for questions based on previous answers
- Required field validation
- Anonymous data storage
- Responsive Design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (Version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or unzip the ZIP file
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development environment:

```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## AI Survey Generation Instructions

To generate survey data using an AI assistant, copy and paste the following instruction set and customize it with your specific survey requirements:

```
I need help creating a survey data structure for a React application. The survey should be defined in JavaScript format and follow these specifications:

1. Survey Structure:
   - The survey needs a title
   - Include startScreen and resultScreen configurations
   - Questions should be organized in sections
   - Each section should have an id, title, and description

2. Question Types Available:
   - text: Single line text input
   - email: Text input with email validation
   - textarea: Multi-line text input
   - number: Numeric input with validation
   - date: Date selection field
   - select: Single selection dropdown
   - multiselect: Multiple selection dropdown
   - checkbox: Boolean checkbox
   - marks_slider: Slider with predefined marks
   - range_slider: Numeric range slider
   - ranked: Drag-and-drop ranking of options

3. Required Fields for Each Question:
   - id: Unique identifier
   - type: Question type
   - label: Display text

4. Common Optional Fields:
   - required: Boolean (true/false)
   - info: Help text
   - hint: Input hint text
   - placeholder: Placeholder text for input fields
   - condition: Object for conditional display

5. Type-Specific Optional Fields:
   - options: Array for select/multiselect/ranked
   - min/max: For number inputs and range sliders
   - step: For numeric inputs
   - unit: For range sliders
   - minDate/maxDate: For date inputs
   - maxSelect: For multiselect
   - marks: For marks_slider
   - validation: Object with validation rules
     - required: Boolean (true/false)
     - email: Boolean for email validation
     - minLength/maxLength: Number for text length validation
     - min/max: Number for numeric value validation
     - pattern: RegExp for custom pattern validation
     - numeric: Boolean for numeric validation

6. StartScreen and ResultScreen Structure:
   - title: Main heading
   - description: Brief description
   - bulletPoints: Array of key points
   - bodyText: Additional text content
   - contactInfo (resultScreen only): Contact information

7. Example Survey Structure:

```javascript
export const surveyData = {
  title: "Customer Feedback Survey",
  
  startScreen: {
    title: "Customer Feedback Survey",
    description: "We value your opinion about our products and services.",
    bulletPoints: [
      "This survey will take approximately 5 minutes to complete",
      "Your feedback helps us improve our offerings",
      "All responses are anonymous"
    ],
    bodyText: "Thank you for taking the time to complete this survey."
  },
  
  resultScreen: {
    title: "Thank You For Your Feedback!",
    description: "Your responses have been submitted successfully.",
    bulletPoints: [
      "Your feedback is valuable to us",
      "We use this information to improve our products and services",
      "We appreciate your time and input"
    ],
    contactInfo: "For questions, please contact: feedback@example.com",
    bodyText: "Thank you for helping us serve you better."
  },
  
  sections: [
    {
      id: "personal_info",
      title: "About You",
      description: "Help us understand who you are",
      questions: [
        {
          id: "age_group",
          type: "select",
          label: "Age Group",
          required: true,
          options: [
            "Under 18",
            "18-24",
            "25-34",
            "35-44",
            "45-54",
            "55+"
          ],
          info: "Select your age range",
          hint: "Please select the option that best represents your age group"
        },
        {
          id: "frequency",
          type: "select",
          label: "How often do you use our product?",
          required: true,
          options: [
            "Daily",
            "Weekly",
            "Monthly",
            "Rarely",
            "First time"
          ],
          hint: "Select the option that best describes your usage frequency"
        }
      ]
    },
    {
      id: "product_feedback",
      title: "Product Feedback",
      description: "Tell us about your experience with our product",
      questions: [
        {
          id: "satisfaction",
          type: "marks_slider",
          label: "Overall Satisfaction",
          required: true,
          marks: {
            1: "Very Dissatisfied",
            2: "Dissatisfied",
            3: "Neutral",
            4: "Satisfied",
            5: "Very Satisfied"
          },
          info: "Rate your overall satisfaction with our product",
          hint: "Slide to select your satisfaction level"
        },
        {
          id: "features_used",
          type: "multiselect",
          label: "Which features do you use?",
          required: true,
          options: [
            "Feature A",
            "Feature B",
            "Feature C",
            "Feature D",
            "Other"
          ],
          info: "Select all features that you use regularly",
          hint: "You can select multiple options"
        },
        {
          id: "other_feature",
          type: "text",
          label: "Please specify other feature",
          placeholder: "Enter feature name",
          condition: { dependsOn: "features_used", value: "Other" },
          info: "This field only appears when 'Other' is selected above",
          validation: {
            minLength: 2,
            maxLength: 50
          },
          hint: "Enter the name of the feature you use"
        },
        {
          id: "improvement_suggestions",
          type: "textarea",
          label: "How can we improve our product?",
          placeholder: "Enter your suggestions here...",
          info: "Share any ideas for improvement",
          validation: {
            maxLength: 500
          },
          hint: "Your feedback helps us improve our product"
        }
      ]
    },
    {
      id: "additional_feedback",
      title: "Additional Feedback",
      description: "Any other comments or suggestions",
      questions: [
        {
          id: "recommend_rating",
          type: "range_slider",
          label: "How likely are you to recommend us?",
          unit: "",
          min: 0,
          max: 10,
          step: 1,
          required: true,
          info: "0 = Not at all likely, 10 = Extremely likely",
          hint: "Drag the slider to select your rating"
        },
        {
          id: "recommend_reason",
          type: "textarea",
          label: "Why did you give this rating?",
          placeholder: "Please explain your rating...",
          condition: { 
            dependsOn: "recommend_rating", 
            value: (val) => val !== undefined 
          },
          info: "Help us understand the reasons behind your rating",
          validation: {
            minLength: 10,
            maxLength: 300
          },
          hint: "Please provide details about your experience"
        }
      ]
    }
  ]
};
```

8. Example Survey Requirements:
   [Describe your specific survey needs here, including:]
   - Survey purpose and title
   - Target audience
   - Number and types of sections
   - Types of questions needed
   - Any conditional logic requirements
   - Start and result screen content

Please generate a complete survey data structure following the format shown in the example above, but customized for my specific needs.
```

The AI will generate a properly structured survey data file that you can paste into `src/data/surveyData_en.js`.

## Question Types Reference

Below is a reference of all available question types and their specific properties:

### Text Input
```javascript
{
  id: "company_name",
  type: "text",
  label: "Company Name",
  placeholder: "Enter company name",
  required: true,
  info: "Please provide your official company name",
  hint: "Enter your legal company name",
  validation: {
    required: true,
    minLength: 2,
    maxLength: 100
  }
}
```

### Email Input
```javascript
{
  id: "contact_email",
  type: "text",
  label: "Contact Email",
  placeholder: "email@example.com",
  required: true,
  validation: {
    email: true,
    required: true
  },
  hint: "Enter a valid email address"
}
```

### Number Input
```javascript
{
  id: "employee_count",
  type: "number",
  label: "Number of Employees",
  placeholder: "Enter number",
  required: true,
  min: 1,
  max: 10000,
  step: 1,
  validation: {
    required: true,
    min: 1,
    max: 10000,
    numeric: true
  },
  hint: "Enter a number between 1 and 10,000"
}
```

### Date Input
```javascript
{
  id: "implementation_date",
  type: "date",
  label: "Implementation Date",
  required: true,
  minDate: "2023-01-01",
  maxDate: "2025-12-31",
  info: "Select the planned implementation date",
  hint: "Click to open date picker"
}
```

### Textarea
```javascript
{
  id: "process_description",
  type: "textarea",
  label: "Describe your current process",
  placeholder: "Enter details here...",
  required: false,
  info: "Provide details about how your current process works",
  validation: {
    minLength: 10,
    maxLength: 500
  },
  hint: "Be as specific as possible in your description"
}
```

### Single Select Dropdown
```javascript
{
  id: "company_size",
  type: "select",
  label: "Company Size",
  required: true,
  options: [
    "1-50 employees",
    "51-250 employees",
    ">250 employees"
  ],
  info: "Select the option that best describes your company size",
  hint: "Choose only one option"
}
```

### Multiple Select
```javascript
{
  id: "used_technologies",
  type: "multiselect",
  label: "Used Technologies",
  required: true,
  options: [
    "ERP System",
    "CRM System",
    "BPM Software",
    "Other"
  ],
  maxSelect: 3,
  info: "Select all technologies currently in use (max 3)",
  hint: "You can select up to 3 options"
}
```

### Checkbox
```javascript
{
  id: "consent",
  type: "checkbox",
  label: "I agree to the privacy policy",
  required: true,
  info: "You must agree to continue",
  hint: "Required to proceed with the survey"
}
```

### Marks Slider
```javascript
{
  id: "process_maturity",
  type: "marks_slider",
  label: "Process Maturity",
  required: true,
  marks: {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
    5: "Master"
  },
  info: "Rate your current process maturity level",
  hint: "Slide to select the appropriate level"
}
```

### Range Slider
```javascript
{
  id: "automation_level",
  type: "range_slider",
  label: "Automation Level",
  unit: "%",
  min: 0,
  max: 100,
  step: 5,
  required: true,
  info: "Indicate the percentage of your process that is automated",
  hint: "Drag the slider to set the percentage"
}
```

### Ranked Selection
```javascript
{
  id: "priority_ranking",
  type: "ranked",
  label: "Priority Ranking",
  required: true,
  options: [
    "Cost Reduction",
    "Process Efficiency",
    "Customer Satisfaction",
    "Employee Experience",
    "Compliance"
  ],
  info: "Rank these items by importance",
  hint: "Drag the elements to order them by priority"
}
```

## Validation Rules

The survey system supports the following validation rules:

```javascript
{
  // Required field validation
  required: true,
  
  // Email format validation
  email: true,
  
  // Text length validation
  minLength: 10,
  maxLength: 500,
  
  // Numeric value validation
  min: 1,
  max: 100,
  
  // Custom pattern validation
  pattern: /^[a-zA-Z0-9]+$/,
  
  // Numeric input validation
  numeric: true
}
```

## Conditional Logic

Questions can be conditionally displayed based on answers to previous questions:

```javascript
// Simple condition based on a specific value
{
  id: "other_technology",
  type: "text",
  label: "Please specify other technology",
  required: true,
  condition: { dependsOn: "used_technologies", value: "Other" },
  info: "This field only appears when 'Other' is selected above"
}

// Function-based condition
{
  id: "high_automation_details",
  type: "textarea",
  label: "Describe your automation approach",
  condition: { 
    dependsOn: "automation_level", 
    value: (val) => val && val > 70 
  },
  info: "This only appears when automation level is greater than 70%"
}
```

## Data Storage

By default, the application stores survey results in the browser's local storage. For a production environment, an external storage service like JSONBin or a custom backend API should be configured.

## License

This project is licensed under the MIT License