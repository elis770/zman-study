import { motion } from "motion/react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { BookMarked, Heart, Scroll, Scale, Calendar, Library } from "lucide-react";
import { useSettings } from "../SettingsContext";

const estudiosData = [
  {
    id: "jumash",
    title: "Jumash",
    titleHebrew: "חומש",
    content: "Bereshit 1:1-6 con Rashi",
    icon: <Scroll style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(219, 234, 254, 0.6)'
  },
  {
    id: "tehilim",
    title: "Tehilim",
    titleHebrew: "תהלים",
    content: "Capítulos 1-9",
    icon: <Heart style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(252, 231, 243, 0.6)'
  },
  {
    id: "tanya",
    title: "Tanya",
    titleHebrew: "תניא",
    content: "Likutei Amarim - Capítulo 5",
    icon: <BookMarked style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(243, 232, 255, 0.6)'
  },
  {
    id: "rambam1",
    title: "Rambam (1 Capítulo)",
    titleHebrew: "רמב״ם",
    content: "Mishné Torá - Hiljot Teshuvá 1:1",
    icon: <Library style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(220, 252, 231, 0.6)'
  },
  {
    id: "rambam3",
    title: "Rambam (3 Capítulos)",
    titleHebrew: "רמב״ם",
    content: "Mishné Torá - Hiljot Teshuvá 1-3",
    icon: <Library style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(209, 250, 229, 0.6)'
  },
  {
    id: "sefer-mitzvot",
    title: "Sefer HaMitzvot",
    titleHebrew: "ספר המצוות",
    content: "Mitzvá Positiva 1",
    icon: <Scale style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(254, 243, 199, 0.6)'
  },
  {
    id: "daf-yomi",
    title: "Daf Yomi",
    titleHebrew: "דף יומי",
    content: "Tratado Berajot 5a",
    icon: <Calendar style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(254, 237, 215, 0.6)'
  },
  {
    id: "hayom-yom",
    title: "Hayom Yom",
    titleHebrew: "היום יום",
    content: "28 de Elul",
    icon: <BookMarked style={{ width: '20px', height: '20px' }} />,
    bgColor: 'rgba(207, 250, 254, 0.6)'
  }
];

export function EstudioSection() {
  const { visibleEstudios } = useSettings();
  
  const filteredEstudios = estudiosData.filter(estudio => visibleEstudios[estudio.id]);
  
  if (filteredEstudios.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)' }}>
          No hay estudios seleccionados. Ve a Configuración para activarlos.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h3" sx={{ color: '#8b7355', mb: 3 }}>
        Estudio de Hoy
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gap: 2, 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } 
      }}>
        {filteredEstudios.map((estudio, index) => (
          <motion.div
            key={estudio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <Card 
              sx={{
                backgroundColor: estudio.bgColor,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(188, 168, 134, 0.3)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ 
                      color: '#8b7355', 
                      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                      p: 1, 
                      borderRadius: '8px' 
                    }}>
                      {estudio.icon}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h4" sx={{ color: '#8b7355', mb: 0.5 }}>
                      {estudio.title}
                    </Typography>
                    <Typography 
                      className="hebrew-text" 
                      sx={{ color: 'rgba(139, 115, 85, 0.8)', fontSize: '0.875rem', mb: 1 }}
                    >
                      {estudio.titleHebrew}
                    </Typography>
                    <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)', fontSize: '0.875rem' }}>
                      {estudio.content}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}