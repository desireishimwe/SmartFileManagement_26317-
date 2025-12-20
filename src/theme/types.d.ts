import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        customShadows: {
            z1: string;
            z8: string;
            z16: string;
            card: string;
            dropdown: string;
        };
    }
    interface ThemeOptions {
        customShadows?: {
            z1?: string;
            z8?: string;
            z16?: string;
            card?: string;
            dropdown?: string;
        };
    }

    interface PaletteColor {
        lighter?: string;
        darker?: string;
    }

    interface SimplePaletteColorOptions {
        lighter?: string;
        darker?: string;
    }
}
