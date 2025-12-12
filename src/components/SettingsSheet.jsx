import { useState } from "react";
import { 
  Drawer, 
  Button, 
  Switch, 
  TextField, 
  Divider, 
  FormControlLabel,
  Typography,
  Box,
  Slider,
  IconButton
} from "@mui/material";
import { Settings, Clock, BookOpen, BookHeart, Church, CalendarDays, MapPin, Globe, X } from "lucide-react";
import { useSettings } from "./SettingsContext";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const { 
    visibleZmanim, 
    visibleEstudios, 
    visibleSections, 
    city,
    timezone,
    carouselInterval,
    toggleZman, 
    toggleEstudio, 
    toggleSection,
    setCity,
    setTimezone,
    setCarouselInterval
  } = useSettings();

  const [tempCity, setTempCity] = useState(city);
  const [tempTimezone, setTempTimezone] = useState(timezone);

  const handleSaveLocation = () => {
    setCity(tempCity);
    setTimezone(tempTimezone);
  };

  const zmanimList = [
    { id: "netz", name: "Netz Hajama", nameHebrew: "נץ החמה" },
    { id: "shema", name: "Sof Zman Shema", nameHebrew: "סוף זמן קריאת שמע" },
    { id: "jatzot", name: "Jatzot Hayom", nameHebrew: "חצות היום" },
    { id: "shkia", name: "Shkiá", nameHebrew: "שקיעת החמה" },
    { id: "tzet", name: "Tzet Hakojabim", nameHebrew: "צאת הכוכבים" }
  ];

  const estudiosList = [
    { id: "jumash", name: "Jumash", nameHebrew: "חומש" },
    { id: "tehilim", name: "Tehilim", nameHebrew: "תהלים" },
    { id: "tanya", name: "Tanya", nameHebrew: "תניא" },
    { id: "rambam1", name: "Rambam (1 Capítulo)", nameHebrew: "רמב״ם" },
    { id: "rambam3", name: "Rambam (3 Capítulos)", nameHebrew: "רמב״ם" },
    { id: "sefer-mitzvot", name: "Sefer HaMitzvot", nameHebrew: "ספר המצוות" },
    { id: "daf-yomi", name: "Daf Yomi", nameHebrew: "דף יומי" },
    { id: "hayom-yom", name: "Hayom Yom", nameHebrew: "היום יום" }
  ];

  const sectionsList = [
    { id: "zmanim", name: "Zmanim", icon: <Clock style={{ width: '16px', height: '16px' }} /> },
    { id: "estudio", name: "Estudio de Hoy", icon: <BookOpen style={{ width: '16px', height: '16px' }} /> },
    { id: "hayom", name: "Hayom Yom", icon: <BookHeart style={{ width: '16px', height: '16px' }} /> },
    { id: "tefilot", name: "Horario de Tefilot", icon: <Church style={{ width: '16px', height: '16px' }} /> },
    { id: "seider", name: "Seider del Día", icon: <CalendarDays style={{ width: '16px', height: '16px' }} /> }
  ];

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(188, 168, 134, 0.2)'
          }
        }}
      >
        <Settings style={{ width: '24px', height: '24px', color: '#8b7355' }} />
      </IconButton>
      
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            background: 'linear-gradient(to bottom right, #f5efe3, #e8dcc3)',
            padding: 3
          }
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#8b7355', fontWeight: 600 }}>
              Configuración
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <X style={{ width: '20px', height: '20px', color: '#8b7355' }} />
            </IconButton>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'rgba(139, 115, 85, 0.7)', mb: 4 }}>
            Personaliza qué elementos deseas ver en la aplicación
          </Typography>

          {/* Ubicación */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#bca886' }} />
              <Typography variant="h6" sx={{ color: '#8b7355' }}>
                Ubicación
              </Typography>
            </Box>
            <Box sx={{ pl: 1 }}>
              <TextField
                fullWidth
                label="Ciudad"
                value={tempCity}
                onChange={(e) => setTempCity(e.target.value)}
                placeholder="Ej: Bogotá"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    '& fieldset': {
                      borderColor: 'rgba(188, 168, 134, 0.3)'
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Zona Horaria"
                value={tempTimezone}
                onChange={(e) => setTempTimezone(e.target.value)}
                placeholder="Ej: America/Bogota"
                sx={{ 
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    '& fieldset': {
                      borderColor: 'rgba(188, 168, 134, 0.3)'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <Globe style={{ width: '16px', height: '16px', marginRight: '8px', color: '#8b7355' }} />
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(139, 115, 85, 0.6)', display: 'block', mb: 2 }}>
                Ejemplos: America/New_York, America/Buenos_Aires, Europe/London
              </Typography>
              <Button
                fullWidth
                onClick={handleSaveLocation}
                sx={{
                  backgroundColor: '#bca886',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#a89474'
                  }
                }}
              >
                Guardar Ubicación
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: 'rgba(188, 168, 134, 0.3)' }} />

          {/* Carrusel Principal */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Clock style={{ width: '20px', height: '20px', color: '#bca886' }} />
              <Typography variant="h6" sx={{ color: '#8b7355' }}>
                Carrusel Principal
              </Typography>
            </Box>
            <Box sx={{ pl: 1 }}>
              <Typography variant="body2" sx={{ color: '#8b7355', mb: 1 }}>
                Cambiar cada {carouselInterval} segundos
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={carouselInterval}
                  onChange={(e, newValue) => setCarouselInterval(newValue)}
                  min={3}
                  max={30}
                  step={1}
                  sx={{
                    flex: 1,
                    color: '#bca886',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#bca886'
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#bca886'
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(188, 168, 134, 0.2)'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#8b7355', minWidth: '3rem', textAlign: 'center', fontWeight: 600 }}>
                  {carouselInterval}s
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(139, 115, 85, 0.6)' }}>
                Tiempo entre cada tarjeta en el carrusel principal
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: 'rgba(188, 168, 134, 0.3)' }} />

          {/* Secciones */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Settings style={{ width: '20px', height: '20px', color: '#bca886' }} />
              <Typography variant="h6" sx={{ color: '#8b7355' }}>
                Secciones
              </Typography>
            </Box>
            <Box sx={{ pl: 1 }}>
              {sectionsList.map((section) => (
                <FormControlLabel
                  key={section.id}
                  control={
                    <Switch
                      checked={visibleSections[section.id]}
                      onChange={() => toggleSection(section.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#bca886',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#bca886',
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: '#8b7355' }}>{section.icon}</Box>
                      <Typography sx={{ color: '#8b7355' }}>{section.name}</Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 0, py: 1 }}
                  labelPlacement="start"
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: 'rgba(188, 168, 134, 0.3)' }} />

          {/* Zmanim */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Clock style={{ width: '20px', height: '20px', color: '#bca886' }} />
              <Typography variant="h6" sx={{ color: '#8b7355' }}>
                Zmanim
              </Typography>
            </Box>
            <Box sx={{ pl: 1 }}>
              {zmanimList.map((zman) => (
                <FormControlLabel
                  key={zman.id}
                  control={
                    <Switch
                      checked={visibleZmanim[zman.id]}
                      onChange={() => toggleZman(zman.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#bca886',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#bca886',
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ color: '#8b7355' }}>{zman.name}</Typography>
                      <Typography className="hebrew-text" sx={{ color: 'rgba(139, 115, 85, 0.6)', fontSize: '0.75rem' }}>
                        {zman.nameHebrew}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 0, py: 1 }}
                  labelPlacement="start"
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: 'rgba(188, 168, 134, 0.3)' }} />

          {/* Estudios */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BookOpen style={{ width: '20px', height: '20px', color: '#bca886' }} />
              <Typography variant="h6" sx={{ color: '#8b7355' }}>
                Estudios
              </Typography>
            </Box>
            <Box sx={{ pl: 1 }}>
              {estudiosList.map((estudio) => (
                <FormControlLabel
                  key={estudio.id}
                  control={
                    <Switch
                      checked={visibleEstudios[estudio.id]}
                      onChange={() => toggleEstudio(estudio.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#bca886',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#bca886',
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ color: '#8b7355' }}>{estudio.name}</Typography>
                      <Typography className="hebrew-text" sx={{ color: 'rgba(139, 115, 85, 0.6)', fontSize: '0.75rem' }}>
                        {estudio.nameHebrew}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 0, py: 1 }}
                  labelPlacement="start"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}