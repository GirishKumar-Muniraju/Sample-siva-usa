module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  testEnvironment: "node",
  testMatch: [
    "**/tests/**/**/*.test.ts",
    "**/tests/**/**/*.spec.ts"
  ],
};
