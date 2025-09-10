import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/Minian.module.css';

const MinianComponent = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the form inside the modal
  const [prayerType, setPrayerType] = useState('shajarit');
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');

  // This will hold the list of minianim, now as state
  const [minianimList, setMinianimList] = useState(() => {
    try {
      const savedMinianim = localStorage.getItem('minianimList');
      return savedMinianim ? JSON.parse(savedMinianim) : [];
    } catch (error) {
      console.error('Could not parse minianim from localStorage', error);
      return [];
    }
  });

  // Effect to save to localStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem('minianimList', JSON.stringify(minianimList));
    } catch (error) {
      console.error('Could not save minianim to localStorage', error);
    }
  }, [minianimList]);

  const handleSaveMinian = (e) => {
    e.preventDefault();
    const newMinian = {
      id: Date.now(),
      type: prayerType,
      time: `${hour}:${minute}`,
    };
    setMinianimList(prevList => 
      [...prevList, newMinian].sort((a, b) => a.time.localeCompare(b.time))
    );
    setIsModalOpen(false);
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

  const handleDeleteMinian = (idToDelete) => {
    setMinianimList(prevList => prevList.filter(minian => minian.id !== idToDelete));
  };

  const prayerIcons = {
    shajarit: '🌅',
    minja: '🌇',
    maariv: '🌃',
  };

  return (
    <>
      <div className={styles.minianContainer}>
        {minianimList.length > 0 && (
          <button className={styles.smallAddButton} onClick={() => setIsModalOpen(true)} title={t('ADD_MINIAN')}>
            ➕
          </button>
        )}
        <div className={styles.minianGridContainer}>
          {minianimList.length > 0 ? (
            minianimList.map(minian => (
              <div key={minian.id} className={styles.minianCard}>
                <span className={styles.minianTypeIcon}>{prayerIcons[minian.type]}</span>
                <div className={styles.minianTextContainer}>
                  <span className={styles.minianType}>{t(minian.type.toUpperCase())}</span>
                  <span className={styles.minianTime}>{minian.time}</span>
                </div>
                <button onClick={() => handleDeleteMinian(minian.id)} className={styles.deleteButton}>&times;</button>
              </div>
            ))
          ) : (
            <div className={styles.addMinianCard} onClick={() => setIsModalOpen(true)}>
              <div className={styles.addMinianIcon}>➕</div>
              <div className={styles.addMinianText}>{t('ADD_MINIAN')}</div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2>{t('ADD_MINIAN')}</h2>
            <form onSubmit={handleSaveMinian} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="prayerType" className={styles.formLabel}>{t('PRAYER')}</label>
                <select id="prayerType" value={prayerType} onChange={(e) => setPrayerType(e.target.value)} className={styles.formSelect}>
                  <option value="shajarit">🌅 {t('SHAJARIT')}</option>
                  <option value="minja">🌇 {t('MINJA')}</option>
                  <option value="maariv">🌃 {t('MAARIV')}</option>
                </select>
              </div>

              <div className={styles.timeSelector}>
                <div className={styles.formGroup}>
                  <label htmlFor="hour" className={styles.formLabel}>{t('HOUR')}</label>
                  <select id="hour" value={hour} onChange={(e) => setHour(e.target.value)} className={styles.formSelect}>
                    {renderHourOptions()}
                  </select>
                </div>
                <span className={styles.timeSeparator}>:</span>
                <div className={styles.formGroup}>
                  <label htmlFor="minute" className={styles.formLabel}>{t('MINUTE')}</label>
                  <select id="minute" value={minute} onChange={(e) => setMinute(e.target.value)} className={styles.formSelect}>
                    {renderMinuteOptions()}
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.saveButton}>{t('SAVE')}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MinianComponent;