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
        {hayomYom.title}
      </h3>
      <div style={{ whiteSpace: 'pre-wrap', direction: 'rtl', textAlign: 'right' }}>
        {hayomYom.text}
      </div>
    </div>
  ) : null;
};

export default HayomYomComponent;

//este es el original implementado segun las traducciones
// return hayomYom.text ? (
//   <div>
//     <h3>
//       {hayomYom.title}
//     </h3>
//     <div style={{ whiteSpace: 'pre-wrap' }}>
//      ={hayomYom.text}
//     </div>
//   </div>
// ) : null;