import { Box, Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { allStudies } from '../hooks/studyConfig.js';

const StudySettings = ({ t, visibleStudies, onStudiesChange, onSelectionChange }) => {
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
        {allStudies.map(study => (
          <FormControlLabel
            key={study.key}
            control={
              <Checkbox
                checked={visibleStudies.includes(study.key)}
                onChange={() => onStudiesChange(study.key)}
                sx={{
                  color: '#bca886',
                  '&.Mui-checked': { color: '#8b7355' }
                }}
              />
            }
            label={t(study.labelKey)}
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

export default StudySettings;