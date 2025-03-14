import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';

import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo';
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (
    <Provider>
      <Toaster />
      <ApolloProvider client={client}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;
