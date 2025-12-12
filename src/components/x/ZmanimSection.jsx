import { motion } from "motion/react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Sunrise, BookOpen, Clock3, Sunset, Moon } from "lucide-react";
import { useSettings } from "../SettingsContext";

const zmanimData = [
  {
    id: "netz",
    name: "Netz Hajama",
    nameHebrew: "נץ החמה",
    time: "05:47",
    icon: <Sunrise style={{ width: '24px', height: '24px' }} />,
    gradient: 'linear-gradient(to bottom right, rgba(254, 215, 170, 0.6), rgba(253, 224, 71, 0.6))'
  },
  {
    id: "shema",
    name: "Sof Zman Shema",
    nameHebrew: "סוף זמן קריאת שמע",
    time: "08:42",
    icon: <BookOpen style={{ width: '24px', height: '24px' }} />,
    gradient: 'linear-gradient(to bottom right, rgba(191, 219, 254, 0.6), rgba(165, 243, 252, 0.6))'
  },
  {
    id: "jatzot",
    name: "Jatzot Hayom",
    nameHebrew: "חצות היום",
    time: "12:05",
    icon: <Clock3 style={{ width: '24px', height: '24px' }} />,
    gradient: 'linear-gradient(to bottom right, rgba(253, 230, 138, 0.6), rgba(254, 215, 170, 0.6))'
  },
  {
    id: "shkia",
    name: "Shkiá",
    nameHebrew: "שקיעת החמה",
    time: "18:23",
    icon: <Sunset style={{ width: '24px', height: '24px' }} />,
    gradient: 'linear-gradient(to bottom right, rgba(251, 207, 232, 0.6), rgba(221, 214, 254, 0.6))'
  },
  {
    id: "tzet",
    name: "Tzet Hakojabim",
    nameHebrew: "צאת הכוכבים",
    time: "19:05",
    icon: <Moon style={{ width: '24px', height: '24px' }} />,
    gradient: 'linear-gradient(to bottom right, rgba(199, 210, 254, 0.6), rgba(147, 197, 253, 0.6))'
  }
];

export function ZmanimSection() {
  const { visibleZmanim } = useSettings();
  
  const filteredZmanim = zmanimData.filter(zman => visibleZmanim[zman.id]);
  
  if (filteredZmanim.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)' }}>
          No hay zmanim seleccionados. Ve a Configuración para activarlos.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h3" sx={{ color: '#8b7355', mb: 3 }}>
        Zmanim del Día
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gap: 2, 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } 
      }}>
        {filteredZmanim.map((zman, index) => (
          <motion.div
            key={zman.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <Card 
              sx={{ 
                background: zman.gradient,
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ color: '#8b7355' }}>
                      {zman.icon}
                    </Box>
                    <Typography 
                      sx={{ 
                        color: '#8b7355', 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        fontVariantNumeric: 'tabular-nums' 
                      }}
                    >
                      {zman.time}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography sx={{ color: '#8b7355', fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                      {zman.name}
                    </Typography>
                    <Typography 
                      className="hebrew-text" 
                      sx={{ color: 'rgba(139, 115, 85, 0.8)', fontSize: '0.875rem' }}
                    >
                      {zman.nameHebrew}
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