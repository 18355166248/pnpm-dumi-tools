module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: [],
  collectCoverage: true,
  collectCoverageFrom: ["!/node_modules/", "!build/", "src/__test__/**/*.ts"],
  coveragePathIgnorePatterns: [],
};
