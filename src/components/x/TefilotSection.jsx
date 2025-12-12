import { useState } from "react";
import { Card, CardContent, Button, TextField, Box, Typography } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";

const initialTefilot = [
  { id: "1", name: "Shajarit", time: "07:00" },
  { id: "2", name: "Minjá", time: "18:00" },
  { id: "3", name: "Arvit", time: "20:00" }
];

export function TefilotSection() {
  const [tefilot, setTefilot] = useState(initialTefilot);
  const [newTefila, setNewTefila] = useState({ name: "", time: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTefila = () => {
    if (newTefila.name && newTefila.time) {
      setTefilot([...tefilot, { id: Date.now().toString(), ...newTefila }]);
      setNewTefila({ name: "", time: "" });
      setIsAdding(false);
    }
  };

  const handleDeleteTefila = (id) => {
    setTefilot(tefilot.filter(t => t.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3" sx={{ color: '#8b7355' }}>
          Horario de Tefilot
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
          Agregar
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                label="Nombre de Tefilá"
                placeholder="Ej: Shajarit"
                value={newTefila.name}
                onChange={(e) => setNewTefila({ ...newTefila, name: e.target.value })}
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
                label="Hora"
                type="time"
                value={newTefila.time}
                onChange={(e) => setNewTefila({ ...newTefila, time: e.target.value })}
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
                  setNewTefila({ name: "", time: "" });
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
                onClick={handleAddTefila}
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

      <Box sx={{ 
        display: 'grid', 
        gap: 2, 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } 
      }}>
        {tefilot.map((tefila) => (
          <Card
            key={tefila.id}
            sx={{
              background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(232, 220, 195, 0.5))',
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
                  <Typography sx={{ color: '#8b7355', fontSize: '1.25rem', fontWeight: 600 }}>
                    {tefila.name}
                  </Typography>
                  <Button
                    onClick={() => handleDeleteTefila(tefila.id)}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      color: 'rgba(139, 115, 85, 0.6)',
                      '&:hover': {
                        color: '#dc2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)'
                      }
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </Button>
                </Box>
                <Typography 
                  sx={{ 
                    color: '#8b7355', 
                    fontSize: '2rem', 
                    fontWeight: 700, 
                    fontVariantNumeric: 'tabular-nums' 
                  }}
                >
                  {tefila.time}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}