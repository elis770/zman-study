import { useState } from 'react';
import { Box, Typography, Divider, Collapse } from "@mui/material";

export const SettingsSection = ({ title, children, defaultExpanded = true, t }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h6"
                sx={{ color: "#8b7355", mb: 1, cursor: "pointer", display: 'flex', alignItems: 'center' }}
                onClick={() => setExpanded(!expanded)}
            >
                {title}
            </Typography>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 1 }}>
                    {children}
                </Box>
            </Collapse>

            <Divider sx={{ mt: 3 }} />
        </Box>
    );
};