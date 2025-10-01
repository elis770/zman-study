import React from 'react';
import TrasladeText from "./TrasladeText.jsx";
import { useAppData } from './DataContext.jsx';
import { useLanguage } from './LanguageContext.jsx';

export const T = () => {
  const {
    todayJumesh, todayTehilim, todaySH, parasha, haftara,
    daf_yomi, Tanya, Rambam1, Rambam3, loading, loadingGeo,
  } = useAppData();
  
  const { language, toggleLanguage } = useLanguage();

  if (loading || loadingGeo) {
    return <div>Cargando estudios...</div>;
  }

  return (
    <div>
      <button onClick={toggleLanguage}>
        Traducir a {language === 'es' ? 'Hebreo' : 'Español'}
      </button>
      <hr />
      {/* <TrasladeText text="שלום עולם" />
      <TrasladeText text={todayJumesh} />
      <TrasladeText text={todayTehilim} /> */}
      <div>Today Jumesh: {todayJumesh}</div>
      <div>Today Tehilim: {todayTehilim}</div>
      <div>Today SH: {todaySH?.he}</div>
      <div>Parasha: {parasha?.he}</div>
      <div>Haftara: {haftara?.he}</div>
      <div>Daf Yomi: {daf_yomi?.he}</div>
      <div>Tanya: {Tanya?.en}</div>
      <div>Rambam 1: {Rambam1?.he}</div>
      <div>Rambam 3: {Rambam3?.he}</div>
      <br />
      <hr />
      <div><TrasladeText text={todaySH?.he} sourceLang="he" /></div>
      <div><TrasladeText text={parasha?.he} sourceLang="he" /></div>
      <div><TrasladeText text={haftara?.he} sourceLang="he" /></div>
      <div><TrasladeText text={daf_yomi?.he} sourceLang="he" /></div>
      <div><TrasladeText text={Tanya?.en} sourceLang="en" /></div>
      <div><TrasladeText text={Rambam1?.he} sourceLang="he" /></div>
      <div><TrasladeText text={Rambam3?.he} sourceLang="he" /></div>
    </div>
  );
}