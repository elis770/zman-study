import { Box, Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { allZmanim } from '../../../context/zmanim/zmanimConfig.js';

const ZmanimSettings = ({ t, visibleZmanim, onZmanimChange, onSelectionChange }) => {
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
          sx={{ borderColor: '#bca886', color: '#8b7355', '&:hover': { borderColor: '#8b7355', backgroundColor: 'rgba(139, 115, 85, 0.04)' } }}
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
                  color: '#bca886',
                  '&.Mui-checked': { color: '#8b7355' }
                }}
              />
            }
            label={t(zman.labelKey)}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.9rem',
                color: '#8b7355'
              }
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default ZmanimSettings;