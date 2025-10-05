import { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import styles from '../styles/AvisosSettings.module.css';

const AddAvisoForm = ({ onAddAviso }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('evento');

  const categoryIcons = {
    evento: '🗓️',
    donacion: '💖',
    clase: '📚',
    recordatorio: '🔔',
    otro: '📢'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddAviso({
      title,
      content,
      category,
      icon: categoryIcons[category]
    });
    // Reset form after submission
    setTitle('');
    setContent('');
    setCategory('evento');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.avisoForm}>
      <h4>{t('ADD_AVISO_TITLE') || 'Agregar Nuevo Aviso'}</h4>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-title">{t('AVISO_TITLE') || 'Título'}</label>
        <input id="aviso-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-content">{t('AVISO_CONTENT') || 'Contenido'}</label>
        <textarea id="aviso-content" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-category">{t('AVISO_CATEGORY') || 'Categoría'}</label>
        <select id="aviso-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="evento">{t('AVISO_EVENT') || 'Evento'}</option>
          <option value="donacion">{t('AVISO_DONATION') || 'Donación'}</option>
          <option value="clase">{t('AVISO_CLASS') || 'Clase/Shiur'}</option>
          <option value="recordatorio">{t('AVISO_REMINDER') || 'Recordatorio'}</option>
          <option value="otro">{t('AVISO_OTHER') || 'Otro'}</option>
        </select>
      </div>
      <button type="submit" className={styles.addButton}>{t('ADD_AVISO_BUTTON') || 'Agregar Aviso'}</button>
    </form>
  );
};

const AvisosSettings = ({ customAvisos, onAddAviso, onDeleteAviso }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <AddAvisoForm onAddAviso={onAddAviso} />
      {customAvisos && customAvisos.length > 0 && (
        <>
          <hr className={styles.divider} />
          <h4>{t('MANAGE_AVISOS') || 'Gestionar Avisos'}</h4>
          <ul className={styles.avisoList}>
            {customAvisos.map(aviso => (
              <li key={aviso.id}>
                <span>{aviso.icon} {aviso.title}</span>
                <button onClick={() => onDeleteAviso(aviso.id)} title={t('DELETE') || 'Eliminar'}>&times;</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default AvisosSettings;