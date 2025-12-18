import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, useTheme } from "@mui/material";
import { X } from "lucide-react";

export function AboutMeDialog({ open, onClose }) {
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
        textAlign: 'center',
        position: 'relative',
        pt: 4,
        pb: 1
      }}>
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute',
            right: 12,
            top: 12,
            color: theme.palette.text.primary,
            '&:hover': { backgroundColor: theme.custom.colors.border.light }
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </IconButton>

        <Box 
          component="img"
          src="/122.png" 
          alt="Eliahu" 
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            mb: 2,
            border: `3px solid ${theme.custom.colors.border.main}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'block',
            mx: 'auto'
          }} 
        />
        
        <Typography variant="h5" sx={{ 
          color: theme.palette.text.primary, 
          fontWeight: 700,
          letterSpacing: '0.02em'
        }}>
          Sobre Mí
        </Typography>
        <Typography variant="h5" sx={{ 
          color: theme.palette.text.primary, 
          fontWeight: 700,
          letterSpacing: '0.02em'
        }}>
          Eliahu Steynberg
          <br />
          Desarrollador de Software
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography sx={{ color: theme.palette.text.primary, mb: 2, lineHeight: 1.7 }}>
             Apasionado por la tecnología y la creación de soluciones que impactan positivamente.
            Este proyecto es una demostración de mis habilidades en React y facilitar el acceso a información
            importante para la vida judía diaria, combinando tecnología moderna con sabiduría ancestral.
          </Typography>

          {/* <Typography sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.7 }}>
            Este proyecto nació del deseo de facilitar el acceso a información
            importante para la vida judía diaria, combinando tecnología moderna
            con sabiduría ancestral.
          </Typography> */}

          <Typography sx={{ color: theme.custom.colors.text.tertiary, fontSize: '0.875rem', fontStyle: 'italic' }}>
             Puedes encontrar más sobre mi trabajo en <a href="https://github.com/elis770" target="_blank" rel="noopener noreferrer">mi GitHub</a>.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}