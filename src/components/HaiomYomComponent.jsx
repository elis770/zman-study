import useHayomYom from '../hooks/useHayomYom';

export const HaiomYomComponent = () => {
  const { title, text, loading, error } = useHayomYom();

  if (loading) {
    return (
      <>
        <h3>Haiom Iom</h3>
        <p>Cargando estudio diario...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h3>Haiom Iom</h3>
        <p style={{ color: '#b00' }}>No se pudo cargar el estudio: {error}</p>
      </>
    );
  }

  return (
    <>
    <h3>Haiom Iom</h3>
      <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
    </>
  );
};