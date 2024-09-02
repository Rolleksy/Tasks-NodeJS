require('dotenv').config({ path: './Backend/.env' });
// turns off console.error
const originalConsoleError = console.error;
console.error = jest.fn();

// turns off console.log
const originalConsoleLog = console.log;
console.log = jest.fn();

// restore console.error
// afterAll(() => {
//   console.error = originalConsoleError;
//   console.log = originalConsoleLog;
// });