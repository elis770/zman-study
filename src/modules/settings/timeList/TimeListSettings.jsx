import { useState } from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, IconButton, useTheme, alpha } from "@mui/material";
import { X } from "lucide-react";
import { useLanguage } from '@/shared/traslantions/useLanguage.js';

const TimeListSettings = ({ list = [], onSave, onDelete, addTitleKey, manageTitleKey }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [prayerType, setPrayerType] = useState('shajarit');
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');

  const handleAdd = (e) => {
    e.preventDefault();
    onSave({ type: prayerType, time: `${hour}:${minute}` });
  };

  const renderHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hourStr = i.toString().padStart(2, '0');
      hours.push(<MenuItem key={hourStr} value={hourStr}>{hourStr}</MenuItem>);
    }
    return hours;
  };

  const renderMinuteOptions = () => ['00', '15', '30', '45'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>);

  const prayerIcons = { shajarit: '🌅', minja: '🌇', maariv: '🌃' };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'primary.main', fontSize: '1rem', fontWeight: 600 }}>
        {t(addTitleKey) || t('ADD_MINIAN') || 'Agregar'}
      </Typography>

      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: 'primary.main' }}>{t('PRAYER') || 'Tefilá'}</InputLabel>
          <Select
            value={prayerType}
            label={t('PRAYER') || 'Tefilá'}
            onChange={(e) => setPrayerType(e.target.value)}
            sx={{ backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'action.hover' }}
          >
            <MenuItem value="shajarit">🌅 {t('SHAJARIT')}</MenuItem>
            <MenuItem value="minja">🌇 {t('MINJA')}</MenuItem>
            <MenuItem value="maariv">🌃 {t('MAARIV')}</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('HOUR') || 'Hora'}</InputLabel>
            <Select
              value={hour}
              label={t('HOUR') || 'Hora'}
              onChange={(e) => setHour(e.target.value)}
              sx={{ backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'action.hover' }}
            >
              {renderHourOptions()}
            </Select>
          </FormControl>
          <Typography>:</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>{t('MINUTE') || 'Minuto'}</InputLabel>
            <Select
              value={minute}
              label={t('MINUTE') || 'Minuto'}
              onChange={(e) => setMinute(e.target.value)}
              sx={{ backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'action.hover' }}
            >
              {renderMinuteOptions()}
            </Select>
          </FormControl>
        </Box>

        <Button type="submit" variant="contained" sx={{ color: 'white', py: 1 }}>
          {t('SAVE') || 'Guardar'}
        </Button>
      </Box>

      {list && list.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontSize: '1rem', mb: 1, fontWeight: 600 }}>
            {t(manageTitleKey) || 'Gestionar'}
          </Typography>
          <List dense sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {list.map(item => (
              <ListItem
                key={item.id}
                sx={{
                  backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'action.hover',
                  borderRadius: '8px',
                  border: `1px solid ${theme.custom?.colors?.border?.main || 'divider'}`
                }}
                secondaryAction={
                  <IconButton edge="end" onClick={() => onDelete(item.id)}>
                    <X size={18} color={theme.palette.primary.main} />
                  </IconButton>
                }
              >
                <ListItemText primary={`${prayerIcons[item.type]} ${t(item.type.toUpperCase())} - ${item.time}`} sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontSize: '0.9rem', fontWeight: 500 } }} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default TimeListSettings;
