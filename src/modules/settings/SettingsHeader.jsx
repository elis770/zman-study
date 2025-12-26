import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { X } from "lucide-react";

export const SettingsHeader = ({ title, onClose }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700 }}>
                {title}
            </Typography>
            <IconButton onClick={onClose}>
                <X color={theme.palette.primary.main} />
            </IconButton>
        </Box>
    );
};