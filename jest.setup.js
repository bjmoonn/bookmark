require('whatwg-fetch');
require('@testing-library/jest-dom');

// Mock fetch responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([])
  })
); 