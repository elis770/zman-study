import { useState } from 'react';
import { useLanguage } from '@/shared/traslantions/useLanguage.js';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Trash2 } from 'lucide-react';

const sxStyles = (theme) => ({
  avisoForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
    marginBottom: '1.5rem',
  },
  formTitle: {
    margin: '0 0 0.5rem 0',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 600,
  },
  divider: {
    margin: '1.5rem 0',
  },
  avisoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  avisoListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    backgroundColor: theme.palette.action.hover,
    borderRadius: '8px',
  },
  deleteButton: {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      color: '#c00',
    },
  },
});


const AddAvisoForm = ({ onAddAviso }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('evento');

  const categoryIcons = {
    evento: '🗓️',
    donacion: '💖',
    clase: '📚',
    recordatorio: '🔔',
    otro: '📢'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddAviso({
      title,
      content,
      category,
      icon: categoryIcons[category]
    });
    // Reset form after submission
    setTitle('');
    setContent('');
    setCategory('evento');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={theme => sxStyles(theme).avisoForm}>
      <Typography variant="h4" sx={theme => sxStyles(theme).formTitle}>
        {t('ADD_AVISO_TITLE') || 'Agregar Nuevo Aviso'}
      </Typography>
      <TextField
        id="aviso-title"
        label={t('AVISO_TITLE') || 'Título'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <TextField
        id="aviso-content"
        label={t('AVISO_CONTENT') || 'Contenido'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
        multiline
        rows={3}
        variant="outlined"
      />
      <FormControl fullWidth>
        <InputLabel id="aviso-category-label">{t('AVISO_CATEGORY') || 'Categoría'}</InputLabel>
        <Select
          labelId="aviso-category-label"
          id="aviso-category"
          value={category}
          label={t('AVISO_CATEGORY') || 'Categoría'}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="evento">{t('AVISO_EVENT') || 'Evento'}</MenuItem>
          <MenuItem value="donacion">{t('AVISO_DONATION') || 'Donación'}</MenuItem>
          <MenuItem value="clase">{t('AVISO_CLASS') || 'Clase/Shiur'}</MenuItem>
          <MenuItem value="recordatorio">{t('AVISO_REMINDER') || 'Recordatorio'}</MenuItem>
          <MenuItem value="otro">{t('AVISO_OTHER') || 'Otro'}</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="outlined" fullWidth>
        {t('ADD_AVISO_BUTTON') || 'Agregar Aviso'}
      </Button>
    </Box>
  );
};

const AvisosSettings = ({ customAvisos, onAddAviso, onDeleteAviso }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const styles = sxStyles(theme);

  return (
    <Box>
      <AddAvisoForm onAddAviso={onAddAviso} />
      {customAvisos && customAvisos.length > 0 && (
        <>
          <Divider sx={styles.divider} />
          <Typography variant="h4" sx={styles.formTitle}>
            {t('MANAGE_AVISOS') || 'Gestionar Avisos'}
          </Typography>
          <List sx={styles.avisoList}>
            {customAvisos.map(aviso => (
              <ListItem key={aviso.id} sx={styles.avisoListItem}>
                <ListItemText primary={`${aviso.icon} ${aviso.title}`} />
                <IconButton onClick={() => onDeleteAviso(aviso.id)} title={t('DELETE') || 'Eliminar'} sx={styles.deleteButton}>
                  <Trash2 size={20} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default AvisosSettings;