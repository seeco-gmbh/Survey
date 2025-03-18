export const surveyData_de = {

  title: "Umfrage-Komponenten Test",

  startScreen: {
    title: "Umfrage-Komponenten Test",
    description: "Dies ist eine Test-Umfrage zur Demonstration aller verfügbaren Fragetypen.",
    bulletPoints: [
      "Diese Umfrage testet alle verfügbaren Fragekomponenten",
      "Es werden keine Daten gespeichert",
      "Sie können mit allen Elementen interagieren"
    ],
    bodyText: "Dies ist eine Test-Umfrage zur Demonstration aller verfügbaren Fragetypen.",
    anonymityNote: "Diese Umfrage ist anonym. Angaben wie email Adressen sind freiwillig und werden nicht in Verbindung mit den Antworten gespeichert. Der Code der Umfrage ist öffentlich zugänglich und kann von jedem geprüft werden. www.github.com/seeco-gmbh/survey." 
  },
  
  // Result screen content
  resultScreen: {
    title: "Test abgeschlossen!",
    description: "Sie haben alle Umfrage-Komponenten erfolgreich getestet.",
    bulletPoints: [
      "Alle Komponenten wurden getestet",
      "Sie können dieses Fenster jetzt schließen",
      "Vielen Dank für Ihre Teilnahme"
    ],
    contactInfo: "Bei Fragen wenden Sie sich bitte an: test@example.com",
    bodyText: "Dies ist eine Test-Umfrage zur Demonstration aller verfügbaren Fragetypen."
  },
  
  // Survey sections
  sections: [
    {
      title: "Bereichs- und Schieberegler-Typen",
      description: "Test der Bereichs- und Schieberegler-Komponenten",
      questions: [
        {
          id: "range_example",
          type: "range_slider",
          label: "Slider mit Bereich",
          min: 0,
          max: 100,
          step: 5,
          unit: "%",
          required: true,
          info: "Dies ist ein Bereichsregler mit Prozentangabe",
          hint: "Geben Sie einen Wert zwischen 0 und 100 ein"
        },
        {
          id: "slider_example",
          type: "marks_slider",
          label: "Slider mit Beschriftungen",
          marks: {
            1: "Sehr schlecht",
            2: "Schlecht",
            3: "Durchschnittlich",
            4: "Gut",
            5: "Sehr gut"
          },
          required: true,
          info: "Dies ist ein Schieberegler mit Textbeschriftungen"
        },
        {
          id: "slider_example_2",
          type: "marks_slider",
          label: "Weiteres Schieberegler-Beispiel",
          required: true,
          marks: {
            1: "Stimme überhaupt nicht zu",
            2: "Stimme nicht zu",
            3: "Neutral",
            4: "Stimme zu",
            5: "Stimme voll zu"
          },
          info: "Dies ist eine Likert-Skala"
        }
      ]
    },
    {
      title: "Grundlegende Eingabetypen",
      description: "Test der grundlegenden Eingabefelder",
      questions: [
        {
          id: "text_example",
          type: "text",
          label: "Text-Eingabe Beispiel",
          placeholder: "Text eingeben",
          required: true,
          info: "Dies ist ein einfaches Texteingabefeld",
          validation: {
            minLength: 3,
            maxLength: 50
          },
          hint: "Geben Sie zwischen 3 und 50 Zeichen ein"
        },
        {
          id: "email_example",
          type: "text",
          label: "E-Mail-Eingabe Beispiel",
          placeholder: "E-Mail-Adresse eingeben",
          required: true,
          info: "Dies ist ein E-Mail-Eingabefeld mit Validierung",
          validation: {
            email: true
          },
          hint: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
        },
        {
          id: "textarea_example",
          type: "textarea",
          label: "Textbereich Beispiel",
          placeholder: "Geben Sie hier einen längeren Text ein",
          info: "Dies ist ein Textbereich für längere Texteingaben"
        },
        {
          id: "number_example",
          type: "number",
          label: "Zahlen-Eingabe Beispiel",
          placeholder: "Zahl eingeben",
          required: true,
          info: "Dies ist ein Zahlen-Eingabefeld",
          min: 1,
          max: 100,
          step: 1,
          hint: "Geben Sie eine Zahl zwischen 1 und 100 ein",
          validation: {
            min: 1,
            max: 100
          }
        },
        {
          id: "date_example",
          type: "date",
          label: "Datums-Eingabe Beispiel",
          info: "Dies ist ein Datumsauswahl-Feld",
          minDate: "2023-01-01",
          maxDate: "2025-12-31"
        }
      ]
    },
    {
      title: "Auswahltypen",
      description: "Test der Auswahlfeld-Typen",
      questions: [
        {
          id: "select_example",
          type: "select",
          label: "Dropdown-Auswahl Beispiel",
          required: true,
          options: [
            "Option 1",
            "Option 2",
            "Option 3",
            "Sonstiges"
          ],
          info: "Dies ist ein Einzelauswahl-Dropdown"
        },
        {
          id: "conditional_example",
          type: "text",
          label: "Dieses Feld erscheint bedingt",
          required: true,
          condition: { dependsOn: "select_example", value: "Sonstiges" },
          info: "Dieses Feld erscheint nur, wenn 'Sonstiges' oben ausgewählt wurde"
        },
        {
          id: "multiselect_limited",
          type: "multiselect",
          label: "Begrenzte Mehrfachauswahl (max. 2)",
          required: true,
          options: [
            "Auswahl 1",
            "Auswahl 2",
            "Auswahl 3",
            "Auswahl 4",
            "Auswahl 5"
          ],
          maxSelect: 2,
          info: "Sie können maximal 2 Optionen auswählen"
        },
        {
          id: "ranked_example",
          type: "ranked",
          label: "Rangfolge-Beispiel",
          required: true,
          options: [
            "Erstes Element",
            "Zweites Element",
            "Drittes Element",
            "Viertes Element",
            "Fünftes Element"
          ],
          hint: "Ziehen Sie die Elemente, um sie nach Präferenz zu ordnen"
        },
        {
          id: "select_example_2",
          type: "select",
          label: "Wählen Sie die nächste Abschnitt, um bedingte Abschnitte zu testen",
          required: true,
          options: [
            "Bedingte Logik",
            "Bereichs- und Schieberegler-Typen"
          ]
        }
      ]
    },
    {
      title: "Bedingte Logik",
      description: "Test der bedingten Anzeigelogik",
      condition: { dependsOn: "select_example_2", value: "Bedingte Logik" },
      questions: [
        {
          id: "trigger_question",
          type: "select",
          label: "Wählen Sie eine Option, um verschiedene Fragen anzuzeigen",
          required: true,
          options: [
            "Textfeld anzeigen",
            "Zahlenfeld anzeigen",
            "Mehrfachauswahl anzeigen",
            "Nichts anzeigen"
          ]
        },
        {
          id: "conditional_text",
          type: "text",
          label: "Bedingtes Textfeld",
          condition: { dependsOn: "trigger_question", value: "Textfeld anzeigen" },
          info: "Dies erscheint, wenn 'Textfeld anzeigen' ausgewählt wurde"
        },
        {
          id: "conditional_number",
          type: "number",
          label: "Bedingtes Zahlenfeld",
          min: 1,
          max: 10,
          condition: { dependsOn: "trigger_question", value: "Zahlenfeld anzeigen" },
          info: "Dies erscheint, wenn 'Zahlenfeld anzeigen' ausgewählt wurde"
        },
        {
          id: "conditional_multiselect",
          type: "multiselect",
          label: "Bedingte Mehrfachauswahl",
          options: [
            "Option 1",
            "Option 2",
            "Option 3"
          ],
          condition: { dependsOn: "trigger_question", value: "Mehrfachauswahl anzeigen" },
          info: "Dies erscheint, wenn 'Mehrfachauswahl anzeigen' ausgewählt wurde"
        },
        {
          id: "function_condition_example",
          type: "text",
          label: "Dies verwendet eine Funktionsbedingung",
          condition: { 
            dependsOn: "number_example", 
            value: (val) => val && val > 50 
          },
          info: "Dies erscheint nur, wenn die Zahl im ersten Abschnitt größer als 50 ist"
        }
      ]
    }
  ]
};
