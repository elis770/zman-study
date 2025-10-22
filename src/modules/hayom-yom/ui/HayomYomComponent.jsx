import { useAppData } from '@/shared/hooks/useAppData.js';
import TrasladeText from '@/shared/context/TrasladeText.jsx';

const HayomYomComponent = () => {
  const { hayomYom, loading, loadingGeo } = useAppData();

  if (loading || loadingGeo) {
    return <p>Cargando estudio diario...</p>;
  }

  if (hayomYom.error) {
    return <p style={{ color: '#b00' }}>No se pudo cargar el estudio: {hayomYom.error}</p>;
  }

  return hayomYom.text ? (
    <div>
      <h3>
        <TrasladeText text={hayomYom.title} sourceLang="he" />
      </h3>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        <TrasladeText text={hayomYom.text} sourceLang="he" />
      </div>
    </div>
  ) : null;
};

export default HayomYomComponent;