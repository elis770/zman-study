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
          maxHeight: { xs: '90vh', md: '80vh' },
          height: { xs: 'auto', md: '50vh' },
          width: { xs: '95vw', md: '50vw' },
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
    >
      <Box
        component="img"
        src="/icon.png"
        alt="kosherClock"
        sx={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          mx: 'auto',
          mt: 3,
          mb: '1rem',
          border: `3px solid ${theme.custom.colors.border.main}`
        }}
      />
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

          <Typography sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 600 }}>
            Informe Técnico:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>Desarrollado con React para una interfaz dinámica y receptiva</li>
            <li>Integración con hebcal y APIs de Sefaria para datos precisos</li>
            <li>Diseño centrado en la facilidad de uso y acceso rápido</li>
            <li>Optimizado para detección automática de ubicación y horarios globales</li>
          </Box>

          <Typography sx={{ color: theme.custom.colors.text.tertiary, fontSize: '0.875rem', fontStyle: 'italic' }}>
            Puedes encontrar más sobre este proyecto en <a href="https://github.com/elis770/zman-study" target="_blank" rel="noopener noreferrer">este link de GitHub</a>.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}