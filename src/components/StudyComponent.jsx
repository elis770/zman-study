import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const StudyComponent = () => {
  const { todayJumesh, todayTehilim, Tanya, Rambam3, loading, loadingGeo } = useAppData();
  const { t, language } = useLanguage();

  if (loading || loadingGeo) {
    return null;
  }

  const studyList = [
    { label: t('JUMASH'), value: todayJumesh },
    { label: t('TEHILIM'), value: todayTehilim },
    { label: t('TANYA'), value: Tanya && Tanya.en },
    {
      label: t('RAMBAM_3'),
      //value: Rambam3 && (language === 'he' ? Rambam3.he : Rambam3.en),
      value: Rambam3 && (Rambam3.he),
    },
  ].filter(item => item.value);

  if (studyList.length === 0) {
    return null;
  }

  return (
    <div style={{
      direction: language === 'he' ? 'rtl' : 'ltr',
      textAlign: language === 'he' ? 'right' : 'left'
    }}>
      <h2>{t('STUDY_TITLE')}</h2>
      {studyList.map(study => (
        <p key={study.label}>
          <strong>{study.label}:</strong> {study.value}
        </p>
      ))}
    </div>
  );
};

export default StudyComponent;