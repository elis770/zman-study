import { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage.js';

const MinianSettings = ({ minianimList, onSaveMinian, onDeleteMinian }) => {
    const { t } = useLanguage();
    const [prayerType, setPrayerType] = useState('shajarit');
    const [hour, setHour] = useState('07');
    const [minute, setMinute] = useState('00');

    const handleAdd = (e) => {
        e.preventDefault();
        onSaveMinian({
            type: prayerType,
            time: `${hour}:${minute}`,
        });
    };

    const renderHourOptions = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            const hourStr = i.toString().padStart(2, '0');
            hours.push(<option key={hourStr} value={hourStr}>{hourStr}</option>);
        }
        return hours;
    };

    const renderMinuteOptions = () => {
        return ['00', '15', '30', '45'].map(min => (
            <option key={min} value={min}>{min}</option>
        ));
    };

    const prayerIcons = {
        shajarit: '🌅',
        minja: '🌇',
        maariv: '🌃',
    };

    return (
        <div className={styles.settingsContainer}>
            <h4>{t('ADD_MINIAN')}</h4>
            <form onSubmit={handleAdd} className={styles.modalForm} style={{ position: 'static', padding: 0, boxShadow: 'none' }}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('PRAYER')}</label>
                    <select value={prayerType} onChange={(e) => setPrayerType(e.target.value)} className={styles.formSelect}>
                        <option value="shajarit">🌅 {t('SHAJARIT')}</option>
                        <option value="minja">🌇 {t('MINJA')}</option>
                        <option value="maariv">🌃 {t('MAARIV')}</option>
                    </select>
                </div>

                <div className={styles.timeSelector}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('HOUR')}</label>
                        <select value={hour} onChange={(e) => setHour(e.target.value)} className={styles.formSelect}>
                            {renderHourOptions()}
                        </select>
                    </div>
                    <span className={styles.timeSeparator}>:</span>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('MINUTE')}</label>
                        <select value={minute} onChange={(e) => setMinute(e.target.value)} className={styles.formSelect}>
                            {renderMinuteOptions()}
                        </select>
                    </div>
                </div>
                <button type="submit" className={styles.saveButton} style={{ width: '100%', marginTop: '1rem' }}>
                    {t('SAVE')}
                </button>
            </form>

            {minianimList.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h4>{t('MANAGE_MINIANIM') || 'Gestionar Minianim'}</h4>
                    <div className={styles.minianList} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {minianimList.map(minian => (
                            <div key={minian.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: '8px'
                            }}>
                                <span>{prayerIcons[minian.type]} {t(minian.type.toUpperCase())} - {minian.time}</span>
                                <button
                                    onClick={() => onDeleteMinian(minian.id)}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        color: '#8b7355'
                                    }}
                                >&times;</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinianSettings;