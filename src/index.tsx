import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';
// ... (el resto de tus importaciones)

// project import
import App from './App';
import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

const container = document.getElementById('root');
const root = createRoot(container!);

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <Provider store={store}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </Provider>
);
