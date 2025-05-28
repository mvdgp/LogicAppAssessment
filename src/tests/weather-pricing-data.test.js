const { getCostPerHourByDate, validateDate } = require('../functions/weather-pricing-data');

// Mock the pricing data for testing
jest.mock('../assets/energyPriceApiResult.json', () => [
  { date: '2025-04-01', costPerHour: 1.5 }
], { virtual: true });

// getCostPerHourByDate function test
describe('getCostPerHourByDate', () => {
  it('returns the correct cost per hour for a valid date', () => {
    expect(getCostPerHourByDate('2025-04-01')).toBe(1.5);
  });

  it('throws an error for a missing date', () => {
    expect(() => getCostPerHourByDate('2025-04-02')).toThrow('No price data found for date: 2025-04-02');
  });
});

// validateDate function test
describe('validateDate', () => {
  it('does not throw an error for a valid date', () => {
    expect(() => validateDate('2025-04-01')).not.toThrow();
  });

  it('throws an error if a date is missing', () => {
    expect(() => validateDate()).toThrow('Date is required');
  });

  it('throws an error for an invalid date format', () => {
    expect(() => validateDate('04-01-2025')).toThrow('Invalid date format. Expected format: YYYY-MM-DD');
    expect(() => validateDate('2025/04/01')).toThrow('Invalid date format. Expected format: YYYY-MM-DD');
    expect(() => validateDate('20250401')).toThrow('Invalid date format. Expected format: YYYY-MM-DD');
  });
});