import { useAppData } from '@/shared/hooks/useAppData.js';
import TrasladeText from '@/shared/context/TrasladeText.jsx';

const HayomYomComponent = () => {
  const appData = useAppData();
  const hayomYom = appData?.study?.hayomYom;
  const loading = appData?.study?.loading;
  const loadingGeo = appData?.study?.loadingGeo;

  // if (loading || loadingGeo) {
  //   return <p>Cargando estudio diario...</p>;
  // }

  if (!hayomYom) {
    return <p>No se pudo cargar el estudio diario.</p>;
  }

  if (hayomYom.error) {
    return <p style={{ color: '#b00' }}>No se pudo cargar el estudio: {hayomYom.error}</p>;
  }

  return hayomYom.text ? (
    <div style={{ margin: '10px 0' }}>
      <h3 style={{ textAlign: 'center' }}>
        {hayomYom.title}
        {/* Si querés traducir dinámicamente: */}
        {/* <TrasladeText sourceLang="he">{hayomYom.title}</TrasladeText> */}
      </h3>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 1.6,
        }}
      >
        {hayomYom.text}
        {/* <TrasladeText sourceLang="he">{hayomYom.text}</TrasladeText> */}
      </div>
    </div>
  ) : null;
};

export default HayomYomComponent;