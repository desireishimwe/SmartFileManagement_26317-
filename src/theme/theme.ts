import { createTheme, alpha } from '@mui/material/styles';

// Premium Color Palette
const PRIMARY = {
  lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  darker: '#061B64',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const customShadows = {
  z1: `0 1px 2px 0 ${alpha(GREY[500], 0.16)}`,
  z8: `0 8px 16px 0 ${alpha(GREY[500], 0.16)}`,
  z16: `0 16px 32px -4px ${alpha(GREY[500], 0.16)}`,
  card: `0 0 2px 0 ${alpha(GREY[500], 0.2)}, 0 12px 24px -4px ${alpha(GREY[500], 0.12)}`,
  dropdown: `0 0 2px 0 ${alpha(GREY[500], 0.24)}, -20px 20px 40px -4px ${alpha(GREY[500], 0.24)}`,
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: PRIMARY,
    secondary: SECONDARY,
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: '#fff',
      default: GREY[100],
    },
    action: {
      active: GREY[600],
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    h2: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    h3: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    h4: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    h5: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    h6: { fontWeight: 700, fontFamily: "'Outfit', sans-serif" },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shadows: [
    'none',
    customShadows.z1,
    customShadows.z1,
    customShadows.z1,
    customShadows.z1,
    customShadows.z1,
    customShadows.z1,
    customShadows.z8, // z8
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z16, // z16
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: GREY[100],
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows.card,
          borderRadius: 16,
          position: 'relative',
          zIndex: 0, 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedInherit: {
          color: GREY[800],
          backgroundColor: GREY[100],
          '&:hover': {
            backgroundColor: GREY[400],
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
