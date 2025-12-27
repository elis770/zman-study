import { Typography, Divider } from "@mui/material";

export const SettingsSection = ({ title, expanded, onToggle, children, showDivider = true }) => {
    return (
        <>
            <Typography variant="h6" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600, mt: 1 }} onClick={onToggle}>
                {title}
            </Typography>
            {expanded && children}
            {showDivider && <Divider sx={{ my: 3 }} />}
        </>
    );
};