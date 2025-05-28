# APPROACH & CHALLENGES REPORT

## Overview

This project demonstrates my approach to enrich a company's weather-based pricing models with pricing information automatically using Azure Logic Apps.

---

## Key Files

- [`src/functions/weather-pricing-data.js`](src/functions/weather-pricing-data.js):  
  Main Azure Function source code for retrieving the relevant pricing data.

- [`logicAppDefinition.json`](logicAppDefinition.json)
  The JSON definition of the Azure Logic App.

---

## Approach

1. **Azure Function App**: Returns pricing data based on a given date
    - Accepts a date as input parameter
    - Validity: checks whether the date parameter is present and has a correct format
    - Returns the pricing info based on given date OR notifies lack of information for the given date
2. **Azure Logic App**: Orchestrates the extraction, enrichment and conversion of data and uploads it to a fileshare
    - Triggered by adding a new file via the sFTP server
    - Performs data extraction from source file
    - Retrieves pricing data by calling the Azure Function
    - Calculates the new property "totalPrice" with the formula "wind speed × price per hour × 24"
    - Enriches the weather data with the new property "totalPrice"
    - Converts the data to XML and uploads it to a FileShare

---

## Challenges Encountered

- **Storing secrets / keys securely**:  
  One of the challenges I faced was safely storing secrets and keys. I had to manually set the key to make a connection to the Azure Function app for example (in my Logic App). I ended up storing the key in a key vault and retrieving it using a Logic App action that was available for it. I could have avoided this if I had chosen .NET while writing my Azure Function, as I could have used the out-of-the-box Azure Function action in Logic Apps, where instead I have used an HTTP action.
- **Using "Azure Function" action in Logic Apps**:
  Because I chose Node.js instead of .NET to write my Azure Function, I faced some necessary detours or limitations later down the line. For example, I wanted to use the "Azure Function" action to call our function app, but that required an Open Api specification and a custom connector OR I should have used .NET (but wanted to show my best capabilities for the assessment by using Node.js). I felt that it didn't make sense to customize this part after choosing Node.js, so I decided think about maintainability and staying out-of-the-box where possible.

---

## Further Improvements

- Next time I would use .NET so that I can utilize the out-of-the-box capabilities of Azure and Logic Apps better
- I left "concurrency control" off in the logic app trigger because the files are small and it's a demo, but in production (if the files are large and very frequent) I would consider enabling that and setting a reasonable limit based on the expected data load, and think about a queueing system