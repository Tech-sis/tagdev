// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// import { UserAuthContextProvider } from './context/UserAuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    // <UserAuthContextProvider>
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
    //  </UserAuthContextProvider>
  );
}
