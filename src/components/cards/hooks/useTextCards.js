import { useSettings } from "../../SettingsContext";
import { useAppData } from "@/shared/hooks/useAppData.js";
import { useLanguage } from "@/shared/hooks/useLanguage.js";

export const useTextCards = () => {
    const { showHayomYom } = useSettings();
    const { hayomYom } = useAppData();
    const { t } = useLanguage();

    if (!showHayomYom) return { hayomYomData: null };

    const data = hayomYom?.hayomYom;
    const loading = hayomYom?.loading;
    
    // Check if we have valid content
    if (!loading && data && !data.error && data.text) {
        return {
            hayomYomData: {
                title: data.title,
                text: data.text
            }
        };
    }

    return { hayomYomData: null };
};