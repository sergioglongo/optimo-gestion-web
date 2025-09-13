import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import AuthInitializer from 'utils/route-guard/AuthInitializer';

// Crea una instancia del cliente de React Query
const queryClient = new QueryClient();

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              <AuthInitializer>
                <>
                  <Notistack>
                    <RouterProvider router={router} />
                    <Snackbar />
                  </Notistack>
                </>
              </AuthInitializer>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </QueryClientProvider>
  );
};

export default App;
