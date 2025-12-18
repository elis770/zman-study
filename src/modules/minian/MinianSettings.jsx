import { useState } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Paper, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { useLanguage } from '@/shared/hooks/useLanguage.js';

const MinianSettings = ({ minianimList, onSaveMinian, onDeleteMinian }) => {
    const { t } = useLanguage();
    const [prayerType, setPrayerType] = useState('shajarit');
    const [hour, setHour] = useState('07');
    const [minute, setMinute] = useState('00');

    const handleAdd = (e) => {
        e.preventDefault();
        onSaveMinian({
            type: prayerType,
            time: `${hour}:${minute}`,
        });
    };

    const renderHourOptions = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            const hourStr = i.toString().padStart(2, '0');
            hours.push(<MenuItem key={hourStr} value={hourStr}>{hourStr}</MenuItem>);
        }
        return hours;
    };

    const renderMinuteOptions = () => {
        return ['00', '15', '30', '45'].map(min => (
            <MenuItem key={min} value={min}>{min}</MenuItem>
        ));
    };

    const prayerIcons = {
        shajarit: '🌅',
        minja: '🌇',
        maariv: '🌃',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ color: '#8b7355', fontSize: '1rem' }}>
                {t('ADD_MINIAN') || 'Agregar Minian'}
            </Typography>

            <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#8b7355' }}>{t('PRAYER') || 'Tefilá'}</InputLabel>
                    <Select
                        value={prayerType}
                        label={t('PRAYER') || 'Tefilá'}
                        onChange={(e) => setPrayerType(e.target.value)}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
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
                            sx={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
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
                            sx={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                        >
                            {renderMinuteOptions()}
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#bca886', color: 'white', '&:hover': { backgroundColor: '#a89474' } }}
                >
                    {t('SAVE') || 'Guardar'}
                </Button>
            </Box>

            {minianimList.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ color: '#8b7355', fontSize: '1rem', mb: 1 }}>
                        {t('MANAGE_MINIANIM') || 'Gestionar Minianim'}
                    </Typography>
                    <List dense sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {minianimList.map(minian => (
                            <ListItem
                                key={minian.id}
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(188, 168, 134, 0.2)'
                                }}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => onDeleteMinian(minian.id)}>
                                        <X size={18} color="#8b7355" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${prayerIcons[minian.type]} ${t(minian.type.toUpperCase())} - ${minian.time}`}
                                    sx={{ '& .MuiListItemText-primary': { color: '#8b7355', fontSize: '0.9rem' } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default MinianSettings;