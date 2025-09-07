import { useAppData } from '../context/DataContext';

const StudyComponent = () => {
  const { todayJumesh, todayTehilim, Tanya, Rambam3 } = useAppData();

  const studyList = [
    { label: 'Jumash', value: todayJumesh },
    { label: 'Tehilim', value: todayTehilim },
    { label: 'Tanya', value: Tanya && Tanya.en },
    {
      label: 'Rambam 3 Perek',
      value: Rambam3 && `${Rambam3.he} - ${Rambam3.en}`,
    },
  ].filter(item => item.value);

  if (studyList.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Estudio de Hoy</h2>
      {studyList.map(study => (
        <p key={study.label}>
          <strong>{study.label}:</strong> {study.value}
        </p>
      ))}
    </div>
  );
};

export default StudyComponent;