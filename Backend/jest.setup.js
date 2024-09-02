require('dotenv').config({ path: "./.env" });
// turns off console.error
const originalConsoleError = console.error;
console.error = jest.fn();

// turns off console.log
const originalConsoleLog = console.log;
console.log = jest.fn();

console.warn = jest.fn();

// restore console.error
// afterAll(() => {
//   console.error = originalConsoleError;
//   console.log = originalConsoleLog;
// });