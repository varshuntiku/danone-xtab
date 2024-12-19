import { createTheme } from '@material-ui/core/styles';
import { palette } from './createPalette';
import { typography } from './createTypography';

export const blueTheme = createTheme({
    typography: typography,
    palette: palette
});
