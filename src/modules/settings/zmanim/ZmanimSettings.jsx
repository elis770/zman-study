import { Box, Button, Checkbox, FormControlLabel, FormGroup, useTheme, alpha } from "@mui/material";
import { allZmanim } from '../../../context/zmanim/zmanimConfig.js';

const ZmanimSettings = ({ t, visibleZmanim, onZmanimChange, onSelectionChange }) => {
  const theme = useTheme();
  // Comprueba si todos los zmanim están seleccionados
  const areAllSelected = visibleZmanim.length === allZmanim.length;

  // Determina la próxima acción y el texto del botón
  const nextAction = areAllSelected ? 'default' : 'all';
  const buttonText = areAllSelected ? t('RESET_DEFAULT') : t('SELECT_ALL');

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onSelectionChange(nextAction)}
          sx={{
            borderColor: theme.custom?.colors?.border?.main || 'primary.light',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          {buttonText}
        </Button>
      </Box>

      <FormGroup sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 1
      }}>
        {allZmanim.map(zman => (
          <FormControlLabel
            key={zman.key}
            control={
              <Checkbox
                checked={visibleZmanim.includes(zman.key)}
                onChange={() => onZmanimChange(zman.key)}
                sx={{
                  color: 'primary.light',
                  '&.Mui-checked': { color: 'primary.main' }
                }}
              />
            }
            label={t(zman.labelKey)}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.9rem',
                color: 'text.primary'
              }
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default ZmanimSettings;