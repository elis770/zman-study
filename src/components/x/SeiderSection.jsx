import { useState } from "react";
import { Card, CardContent, Button, TextField, Box, Typography } from "@mui/material";
import { Plus, GripVertical, Trash2 } from "lucide-react";

const initialSeider = [
  { id: "1", activity: "Jsides", startTime: "06:00", endTime: "07:00" },
  { id: "2", activity: "Tefilá", startTime: "07:00", endTime: "08:30" },
  { id: "3", activity: "Desayuno", startTime: "08:30", endTime: "09:00" },
  { id: "4", activity: "Guemará Iyuná", startTime: "09:00", endTime: "12:00" },
  { id: "5", activity: "Almuerzo", startTime: "12:00", endTime: "13:00" },
  { id: "6", activity: "Guemará Guirsá", startTime: "13:00", endTime: "15:00" },
  { id: "7", activity: "Halajá", startTime: "15:00", endTime: "16:00" },
  { id: "8", activity: "Cena", startTime: "19:00", endTime: "20:00" },
  { id: "9", activity: "Jsides Erev", startTime: "20:00", endTime: "21:00" },
  { id: "10", activity: "Seider Sijot", startTime: "21:00", endTime: "22:00" }
];

export function SeiderSection() {
  const [seider, setSeider] = useState(initialSeider);
  const [newItem, setNewItem] = useState({ activity: "", startTime: "", endTime: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = () => {
    if (newItem.activity && newItem.startTime && newItem.endTime) {
      setSeider([...seider, { id: Date.now().toString(), ...newItem }]);
      setNewItem({ activity: "", startTime: "", endTime: "" });
      setIsAdding(false);
    }
  };

  const handleDeleteItem = (id) => {
    setSeider(seider.filter(item => item.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3" sx={{ color: '#8b7355' }}>
          Seider del Día
        </Typography>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="contained"
          startIcon={<Plus style={{ width: '16px', height: '16px' }} />}
          sx={{
            backgroundColor: '#bca886',
            '&:hover': {
              backgroundColor: '#a89474'
            },
            textTransform: 'none'
          }}
        >
          Agregar Actividad
        </Button>
      </Box>

      {isAdding && (
        <Card 
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(188, 168, 134, 0.3)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            mb: 2
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                label="Actividad"
                placeholder="Ej: Guemará"
                value={newItem.activity}
                onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(188, 168, 134, 0.3)'
                    }
                  }
                }}
              />
              <TextField
                label="Hora de Inicio"
                type="time"
                value={newItem.startTime}
                onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(188, 168, 134, 0.3)'
                    }
                  }
                }}
              />
              <TextField
                label="Hora de Fin"
                type="time"
                value={newItem.endTime}
                onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(188, 168, 134, 0.3)'
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAdding(false);
                  setNewItem({ activity: "", startTime: "", endTime: "" });
                }}
                sx={{
                  borderColor: 'rgba(188, 168, 134, 0.3)',
                  color: '#8b7355',
                  textTransform: 'none'
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleAddItem}
                sx={{
                  backgroundColor: '#bca886',
                  '&:hover': {
                    backgroundColor: '#a89474'
                  },
                  textTransform: 'none'
                }}
              >
                Guardar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card 
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(188, 168, 134, 0.3)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ '& > div:not(:last-child)': { borderBottom: '1px solid rgba(188, 168, 134, 0.2)' } }}>
          {seider.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(232, 220, 195, 0.2)',
                  '& .delete-button': {
                    opacity: { xs: 1, md: 1 }
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GripVertical style={{ width: '20px', height: '20px', color: 'rgba(139, 115, 85, 0.4)', cursor: 'move' }} />
                
                <Box sx={{ 
                  flex: 1, 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
                  gap: 2, 
                  alignItems: 'center' 
                }}>
                  <Typography sx={{ color: '#8b7355', fontSize: '1.125rem', fontWeight: 600 }}>
                    {item.activity}
                  </Typography>
                  <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)', fontVariantNumeric: 'tabular-nums' }}>
                    {item.startTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)', fontVariantNumeric: 'tabular-nums' }}>
                      {item.endTime}
                    </Typography>
                    <Button
                      className="delete-button"
                      onClick={() => handleDeleteItem(item.id)}
                      size="small"
                      sx={{
                        minWidth: 'auto',
                        opacity: { xs: 1, md: 0 },
                        color: 'rgba(139, 115, 85, 0.6)',
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          color: '#dc2626',
                          backgroundColor: 'rgba(220, 38, 38, 0.1)'
                        }
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      <Box sx={{ 
        backgroundColor: 'rgba(232, 220, 195, 0.4)', 
        backdropFilter: 'blur(4px)', 
        border: '1px solid rgba(188, 168, 134, 0.3)', 
        borderRadius: '8px', 
        p: 2,
        mt: 2
      }}>
        <Typography sx={{ color: 'rgba(139, 115, 85, 0.7)', fontSize: '0.875rem' }}>
          💡 <strong>Consejo:</strong> Arrastra las actividades para reorganizar tu horario diario.
        </Typography>
      </Box>
    </Box>
  );
}