export const surveyData_en = {

  title: "Survey Components Test",

  startScreen: {
    title: "Survey Components Test",
    description: "This is a test survey to demonstrate all available question types.",
    bulletPoints: [
      "This survey tests all available question components",
      "No data will be stored",
      "You can interact with all elements"
    ],
    bodyText: "This is a test survey to demonstrate all available question types."
  },
  
  // Result screen content
  resultScreen: {
    title: "Test completed!",
    description: "You have successfully tested all survey components.",
    bulletPoints: [
      "All components have been tested",
      "You can now close this window",
      "Thank you for your participation"
    ],
    contactInfo: "For questions, please contact: test@example.com",
    bodyText: "This is a test survey to demonstrate all available question types."
  },
  
  // Survey sections
  sections: [
    {
      title: "Range and Slider Types",
      description: "Test of range and slider components",
      questions: [
        {
          id: "range_example",
          type: "range_slider",
          label: "Range Slider",
          min: 0,
          max: 100,
          step: 5,
          unit: "%",
          required: true,
          info: "This is a range slider with percentage",
          hint: "This is a range slider with percentage"
        },
        {
          id: "slider_example",
          type: "marks_slider",
          label: "Slider with Labels",
          marks: {
            1: "Very Poor",
            2: "Poor",
            3: "Average",
            4: "Good",
            5: "Very Good"
          },
          required: true,
          info: "This is a slider with text labels",
          hint: "This is a slider with text labels"
        },
        {
          id: "slider_example_2",
          type: "marks_slider",
          label: "Another Slider Example",
          required: true,
          marks: {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Neutral",
            4: "Agree",
            5: "Strongly Agree"
          },
          info: "This is a Likert scale",
          hint: "This is a Likert scale"
        }
      ]
    },
    {
      title: "Basic Input Types",
      description: "Test of basic input fields",
      questions: [
        {
          id: "text_example",
          type: "text",
          label: "Text Input Example",
          placeholder: "Enter text",
          required: true,
          info: "This is a simple text input field",
          validation: {
            minLength: 3,
            maxLength: 50
          },
          hint: "Enter between 3 and 50 characters"
        },
        {
          id: "email_example",
          type: "text",
          label: "Email Input Example",
          placeholder: "Enter email address",
          required: true,
          info: "This is an email input field with validation",
          validation: {
            email: true
          },
          hint: "Please enter a valid email address"
        },
        {
          id: "textarea_example",
          type: "textarea",
          label: "Textarea Example",
          placeholder: "Enter a longer text here",
          info: "This is a textarea for longer text input"
        },
        {
          id: "number_example",
          type: "number",
          label: "Number Input Example",
          placeholder: "Enter number",
          required: true,
          info: "This is a number input field",
          min: 1,
          max: 100,
          step: 1,
          hint: "Enter a number between 1 and 100",
          validation: {
            min: 1,
            max: 100
          }
        },
        {
          id: "date_example",
          type: "date",
          label: "Date Input Example",
          info: "This is a date selection field",
          validation: {
            minDate: "2025-01-01",
            maxDate: "2025-12-31"
          }
        }
      ]
    },
    {
      title: "Selection Types",
      description: "Test of selection field types",
      questions: [
        {
          id: "select_example",
          type: "select",
          label: "Dropdown Selection Example",
          required: true,
          options: [
            "Option 1",
            "Option 2",
            "Option 3",
            "Other"
          ],
          info: "This is a single-select dropdown"
        },
        {
          id: "conditional_example",
          type: "text",
          label: "This field appears conditionally",
          required: true,
          condition: { dependsOn: "select_example", value: "Other" },
          info: "This field only appears when 'Other' is selected above"
        },
        {
          id: "multiselect_example",
          type: "multiselect",
          label: "Multi-select Example",
          required: true,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"
          ],
          info: "You can select multiple options"
        },
        {
          id: "multiselect_limited",
          type: "multiselect",
          label: "Limited Multi-select (max. 2)",
          required: true,
          options: [
            "Selection 1",
            "Selection 2",
            "Selection 3",
            "Selection 4",
            "Selection 5"
          ],
          maxSelect: 2,
          info: "You can select a maximum of 2 options"
        },
        {
          id: "ranked_example",
          type: "ranked",
          label: "Ranking Example",
          required: true,
          options: [
            "First Element",
            "Second Element",
            "Third Element",
            "Fourth Element",
            "Fifth Element"
          ],
          hint: "Drag the elements to order them by preference"
        }
      ]
    },
    {
      title: "Conditional Logic",
      description: "Test of conditional display logic",
      questions: [
        {
          id: "trigger_question",
          type: "select",
          label: "Select an option to show different questions",
          required: true,
          options: [
            "Show text field",
            "Show number field",
            "Show multi-select",
            "Show nothing"
          ]
        },
        {
          id: "conditional_text",
          type: "text",
          label: "Conditional Text Field",
          condition: { dependsOn: "trigger_question", value: "Show text field" },
          info: "This appears when 'Show text field' is selected"
        },
        {
          id: "conditional_number",
          type: "number",
          label: "Conditional Number Field",
          min: 1,
          max: 10,
          condition: { dependsOn: "trigger_question", value: "Show number field" },
          info: "This appears when 'Show number field' is selected"
        },
        {
          id: "conditional_multiselect",
          type: "multiselect",
          label: "Conditional Multi-select",
          options: [
            "Option 1",
            "Option 2",
            "Option 3"
          ],
          condition: { dependsOn: "trigger_question", value: "Show multi-select" },
          info: "This appears when 'Show multi-select' is selected"
        },
        {
          id: "function_condition_example",
          type: "text",
          label: "This uses a function condition",
          condition: { 
            dependsOn: "number_example", 
            value: (val) => val && val > 50 
          },
          info: "This only appears when the number in the first section is greater than 50"
        }
      ]
    }
  ]
};
