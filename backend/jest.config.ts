import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  coverageReporters: ["text", "lcov"],
  verbose: true,
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;