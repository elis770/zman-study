import {
  shouldShowChatzot,
  shouldShowNetz,
  isFriday,
} from '../utils/dateChecks';
import { useAppData } from '../context/DataContext';

const ZmanimComponent = () => {
  const {
    date,
    hebrewDate,
    sunrise,
    sofZmanShma,
    shkiah,
    tzet,
    candleLighting,
    chatzot,
  } = useAppData();

  const zmanimList = [
    {
      label: 'Netz Hajama',
      value: sunrise,
      show: shouldShowNetz(hebrewDate) && sunrise,
    },
    { label: 'Sof Shema', value: sofZmanShma, show: !!sofZmanShma },
    { label: 'Shkia', value: shkiah, show: !!shkiah },
    {
      label: 'Encendido de velas',
      value: candleLighting,
      show: isFriday(date) && candleLighting,
    },
    { label: 'Tzet hakojabim', value: tzet, show: !!tzet },
    {
      label: 'Jatzot',
      value: chatzot,
      show: shouldShowChatzot(hebrewDate) && chatzot,
    },
  ].filter(item => item.show);

  if (zmanimList.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Zmanim</h2>
      {zmanimList.map(zman => (
        <p key={zman.label}>
          <strong>{zman.label}:</strong> {zman.value}
        </p>
      ))}
    </div>
  );
};

export default ZmanimComponent;