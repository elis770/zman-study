import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, TextField, Paper, List, ListItemButton, ListItemText, Button, useTheme } from "@mui/material";
import { MapPin } from "lucide-react";
import { cityList } from "./cities.js";
import useUserLocation from "../../../data/time/useUserLocation.js";

export const CitySettings = ({ t, userCity, onUserCityChange }) => {
    const theme = useTheme();
    const [cityInput, setCityInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const cityInputWrapperRef = useRef(null);
    const { getUserLocation } = useUserLocation();

    const handleDetectByIp = useCallback(async () => {
        try {
            const location = await getUserLocation();
            if (location?.city) {
                onUserCityChange(location.city);
                setCityInput("");
                setShowSuggestions(false);
            } else {
                alert("No se pudo detectar la ubicación.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al detectar la ubicación.");
        }
    }, [getUserLocation, onUserCityChange]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cityInputWrapperRef.current && !cityInputWrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCityInput(value);
        setSelectedSuggestionIndex(-1);

        if (value.length > 1) {
            const filtered = cityList.filter((city) =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const cityName = suggestion.split(",")[0];
        onUserCityChange(cityName);
        setCityInput("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > -1 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            if (selectedSuggestionIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick(suggestions[selectedSuggestionIndex]);
            }
        }
    };

    const handleSaveCity = () => {
        if (!cityInput.trim()) return;
        const cityName = cityInput.split(",")[0].trim();
        onUserCityChange(cityName);
        setCityInput("");
        setShowSuggestions(false);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <MapPin color={theme.palette.primary.light} />
                <Typography sx={{ color: "primary.main", fontWeight: 600 }}>
                    {t("CITY_LABEL") || "Ciudad"}
                </Typography>
            </Box>
            <Box ref={cityInputWrapperRef} sx={{ position: "relative" }}>
                <TextField fullWidth value={cityInput} onChange={handleCityChange} onKeyDown={handleKeyDown} onFocus={() => cityInput.length > 1 && setShowSuggestions(true)} placeholder={userCity || t("CITY_PLACEHOLDER") || "Ej: New York"} autoComplete="off" sx={{ mb: 2, "& .MuiOutlinedInput-root": { backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'background.paper' } }} />
                {showSuggestions && suggestions.length > 0 && (
                    <Paper sx={{ position: "absolute", width: "100%", zIndex: 10, maxHeight: 200, overflowY: "auto" }}>
                        <List dense>
                            {suggestions.map((s, index) => (
                                <ListItemButton key={s} onClick={() => handleSuggestionClick(s)} selected={index === selectedSuggestionIndex} sx={{ "&.Mui-selected": { backgroundColor: "primary.light", color: "primary.contrastText", "&:hover": { backgroundColor: "primary.main" } } }}>
                                    <ListItemText primary={s} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Button fullWidth variant="contained" onClick={handleSaveCity} sx={{ py: 1 }}>{t("SAVE") || "Guardar"}</Button>
                <Button fullWidth variant="outlined" onClick={handleDetectByIp}>{t("DETECT_IP_BUTTON") || "Detectar por IP"}</Button>
            </Box>
        </Box>
    );
};