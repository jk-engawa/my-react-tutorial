import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import DiaryDetail from './components/DiaryDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<DiaryList />} />
            <Route path="/new" element={<DiaryForm />} />
            <Route path="/diary/:id" element={<DiaryDetail />} />
            <Route path="/edit/:id" element={<DiaryForm />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;