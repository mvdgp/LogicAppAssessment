const { app } = require('@azure/functions');
const weatherPricingData = require('../assets/energyPriceApiResult.json');

/**
 * Validates the input date and ensures it matches the expected format.
 * @param {string} date - The date string to validate.
 * @throws Will throw an error if the date is invalid or not provided.
 */
const validateDate = (date) => {
    if (!date) {
        throw new Error('Date is required');
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        throw new Error('Invalid date format. Expected format: YYYY-MM-DD');
    }
};

/**
 * Retrieves the cost per hour for a given date from the weatherPricingData array.
 * @param {string} date - The date string to look up.
 * @returns {number} - The cost per hour for the given date.
 * @throws Will throw an error if no data is found for the given date.
 */
const getCostPerHourByDate = (date) => {

    // Validate the date format
    validateDate(date);

    const weatherPricingMap = new Map(weatherPricingData.map(data => [data.date, data.costPerHour]));
    const costPerHour = weatherPricingMap.get(date);

    if (!costPerHour) {
        throw new Error(`No price data found for date: ${date}`);
    }

    return costPerHour;
};

/**
 * HTTP-triggered Azure Function to retrieve the cost per hour for a specific date.
 * 
 * @name weather-pricing-data
 * @method GET
 * @authLevel function
 * 
 * @param {object} request - The HTTP request object.
 * @param {object} context - The Azure Function context object.
 * @returns {object} - The HTTP response containing the cost per hour or an error message.
 * 
 * @throws {Error} - Returns a 400 status code if the date is invalid or not found.
 */
app.http('weather-pricing-data', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {

        try {
            const date = request.query.get('date');
            const costPerHour = getCostPerHourByDate(date);

            // Return the cost per hour for the specified date
            return { body: costPerHour };

        } catch (error) {
            context.log(`Error occurred: ${error.message}`);
            return { status: 400, body: error.message };
        }
    }
});