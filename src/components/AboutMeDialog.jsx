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
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: theme.palette.text.primary,
        fontWeight: 600,
        pb: 1
      }}>
        Sobre Mí
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
            ¡Shalom! Soy un desarrollador apasionado por crear herramientas que 
            ayuden a las personas a conectarse con sus tradiciones y valores.
          </Typography>
          
          <Typography sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.7 }}>
            Este proyecto nació del deseo de facilitar el acceso a información 
            importante para la vida judía diaria, combinando tecnología moderna 
            con sabiduría ancestral.
          </Typography>
          
          <Typography sx={{ color: theme.custom.colors.text.tertiary, fontSize: '0.875rem', fontStyle: 'italic' }}>
            "La tecnología al servicio de la tradición"
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}