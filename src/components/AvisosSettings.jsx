import { useState } from 'react';
import styles from '../style/AvisosSettings.module.css';

const AddAvisoForm = ({ onAddAviso }) => {
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
      <h4>Agregar Nuevo Aviso</h4>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-title">Título</label>
        <input id="aviso-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-content">Contenido</label>
        <textarea id="aviso-content" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="aviso-category">Categoría</label>
        <select id="aviso-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="evento">Evento</option>
          <option value="donacion">Donación</option>
          <option value="clase">Clase/Shiur</option>
          <option value="recordatorio">Recordatorio</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <button type="submit" className={styles.addButton}>Agregar Aviso</button>
    </form>
  );
};

const AvisosSettings = ({ customAvisos, onAddAviso, onDeleteAviso }) => {
  return (
    <>
      <AddAvisoForm onAddAviso={onAddAviso} />
      {customAvisos && customAvisos.length > 0 && (
        <>
          <hr className={styles.divider} />
          <h4>Gestionar Avisos</h4>
          <ul className={styles.avisoList}>
            {customAvisos.map(aviso => (
              <li key={aviso.id}>
                <span>{aviso.icon} {aviso.title}</span>
                <button onClick={() => onDeleteAviso(aviso.id)} title="Eliminar">&times;</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default AvisosSettings;