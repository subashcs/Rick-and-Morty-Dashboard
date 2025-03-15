# Rick and Morty API Dashboard

This is a UI implementation using the Rick and Morty GraphQL API. The project leverages modern technologies such as Vite for build tooling, Chakra UI for component styling, React for building the user interface, Ag-Grid-React for advanced data grid features, and Apollo GraphQL client for data fetching.

## Features

- **Vite**: Fast and optimized development build setup.
- **Chakra UI**: Provides a set of accessible and reusable React components.
- **React**: A JavaScript library for building user interfaces.
- **Ag-Grid-React**: A feature-rich data grid supporting major JavaScript frameworks.
- **Apollo GraphQL Client**: A comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.

## Node JS

Check `.nvmrc` for Node JS version

## Testing

Testing is configured with **Vitest** to ensure reliability and maintainability of the codebase.

1. **Run tests**:

   ```bash
   yarn run test
   yarn run test:watch
   ```

2. **Check test coverage**:
   ```bash
   yarn run coverage
   ```

## Getting Started

To get the project up and running, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Rick-and-Morty-Dashboard
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Generate code from GraphQL schema**:

   ```bash
   yarn run codegen
   ```

   For development, we can use command:

   ```bash
   yarn run codegen --watch
   ```

4. **Run the development server**:

   ```bash
   yarn run dev
   ```

5. **Build the project for production**:

   ```bash
   yarn run build
   ```

6. **Preview the production build**:

   ```bash
   yarn run preview
   ```

By following these steps, you will be able to set up the project environment and explore the features of the Rick and Morty API Dashboard.

_Note: The Characters view and Episodes view demonstrate different ways of rendering table data using AG Grid. Also, the different ways of using the External search field to filter data_
