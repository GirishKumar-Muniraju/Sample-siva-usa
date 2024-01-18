# au743-nuc-wrs-user-feedback-lambda

Repository template for AWS Lambdas runnning Typescript, utilizing GitHub Actions CI/CD.


# Project Documentation
 
## Setup
 
Before running any scripts, make sure to install the project dependencies:
 
```bash
npm install
```
 
## Scripts
 
### Linting
 
- **Lint**: Lints and auto-fixes the code.
 
  ```bash
  npm run lint
  ```
 
### Building
 
- **Build**: Lints the code, compiles TypeScript to JavaScript, and copies the `.env` file to the `dist` directory.
 
  ```bash
  npm run build
  ```
 
### Testing
 
- **Test**: Runs tests using Mocha with ts-node. It sets an environment variable for testing purposes.
 
  ```bash
  npm run test
  ```
 
- **Coverage**: Generates test coverage reports, excluding test files and migration files.
 
  ```bash
  npm run coverage
  ```
 
### Running the Application
 
- **API Server**: Builds the application and then starts the server from the `dist` directory.
 
  ```bash
  npm run api-server
  ```
 
### Development
 
- **Dev:Debug**: Runs the application in development mode with debugging enabled.
 
  ```bash
  npm run dev:debug
  ```
 
### Database Migrations
 
 
- **Migration Run**: Applies all pending migrations.
 
  ```bash
  npm run m:run
  ```
 
- **Migration Revert**: Reverts the last applied migration.
 
  ```bash
  npm run m:revert
  ```
 
- **Migration Create**: Creates a new migration file with the specified name.
 
  ```bash
  npm run m:create --name=YourMigrationName
  ```