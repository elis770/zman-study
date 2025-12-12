import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, useTheme } from "@mui/material";
import { X } from "lucide-react";

export function AboutProjectDialog({ open, onClose }) {
  const theme = useTheme();
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(to bottom right, ${theme.custom.colors.glass.backgroundLight}, ${theme.custom.colors.glass.backgroundDark})`,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.custom.colors.border.main}`,
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: theme.palette.text.primary,
        fontWeight: 600,
        pb: 1
      }}>
        Sobre el Proyecto
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': { backgroundColor: theme.custom.colors.border.light }
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography sx={{ color: theme.palette.text.primary, mb: 2, lineHeight: 1.7 }}>
            <strong>KosherClock</strong> es una aplicación diseñada para ayudar a la comunidad judía 
            a mantenerse conectada con sus tradiciones diarias.
          </Typography>
          
          <Typography sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.7 }}>
            Proporciona acceso rápido a:
          </Typography>
          
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>Zmanim (tiempos halájicos) precisos para tu ubicación</li>
            <li>Calendario hebreo y gregoriano</li>
            <li>Plan de estudio diario (Jumash, Tanya, Tehilim, etc.)</li>
            <li>Hayom Yom - enseñanzas diarias</li>
            <li>Tefilot y oraciones</li>
            <li>Seider Hayom - orden del día</li>
          </Box>
          
          <Typography sx={{ color: theme.custom.colors.text.tertiary, fontSize: '0.875rem', fontStyle: 'italic' }}>
            Desarrollado con dedicación para servir a la comunidad.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}