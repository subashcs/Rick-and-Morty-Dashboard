# Rick and Morty API Dashboard

This is a UI implementation using the Rick and Morty GraphQL API. The project leverages modern technologies such as Vite for build tooling, Chakra UI for component styling, React for building the user interface, Ag-Grid-React for advanced data grid features, and Apollo GraphQL client for data fetching.

## Features

- **Vite**: Fast and optimized development build setup.
- **Chakra UI**: Provides a set of accessible and reusable React components.
- **React**: A JavaScript library for building user interfaces.
- **Ag-Grid-React**: A feature-rich data grid supporting major JavaScript frameworks.
- **Apollo GraphQL Client**: A comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.

## Testing

Testing is configured with **Vitest** to ensure reliability and maintainability of the codebase.

## Getting Started

To get the project up and running, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd rick-morty-dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Generate code from GraphQL schema**:

   ```bash
   npm run codegen
   ```

   For development, we can use command:

   ```bash
   npm run codegen --watch
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Build the project for production**:

   ```bash
   npm run build
   ```

6. **Preview the production build**:

   ```bash
   npm run preview
   ```

7. **Run tests**:

   ```bash
   npm run test
   ```

8. **Check test coverage**:
   ```bash
   npm run coverage
   ```

By following these steps, you will be able to set up the project environment and explore the features of the Rick and Morty API Dashboard.
