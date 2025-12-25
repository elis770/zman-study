import { Box, Button, Checkbox, FormControlLabel, FormGroup, useTheme, alpha } from "@mui/material";
import { allStudies } from './context/studyConfig.js';

const StudySettings = ({ t, visibleStudies, onStudiesChange, onSelectionChange }) => {
  const theme = useTheme();
  // Comprueba si todos los estudios están seleccionados
  const areAllSelected = visibleStudies.length === allStudies.length;

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
        {allStudies.map(study => (
          <FormControlLabel
            key={study.key}
            control={
              <Checkbox
                checked={visibleStudies.includes(study.key)}
                onChange={() => onStudiesChange(study.key)}
                sx={{
                  color: 'primary.light',
                  '&.Mui-checked': { color: 'primary.main' }
                }}
              />
            }
            label={t(study.labelKey)}
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

export default StudySettings;