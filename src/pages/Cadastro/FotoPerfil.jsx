import { useId, useState } from 'react';
import { Avatar } from '@/components/ui';
import styles from './Cadastro.module.css';

/** Foto com preview dentro do círculo. A API não guarda foto, então ela não é enviada. */
export default function FotoPerfil({ fotoAtual, nome }) {
  const campoId = useId();
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState('');

  const aoEscolher = (evento) => {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      setErro('Escolha um arquivo de imagem.');
      return;
    }

    setErro('');
    const leitor = new FileReader();
    leitor.onload = () => setPreview(leitor.result);
    leitor.readAsDataURL(arquivo);
  };

  return (
    <div className={styles.foto}>
      <input
        id={campoId}
        type="file"
        accept="image/*"
        className={styles.inputFoto}
        aria-describedby={`${campoId}-dica`}
        onChange={aoEscolher}
      />
      <label htmlFor={campoId} className={styles.rotuloFoto}>
        <Avatar
          src={preview ?? fotoAtual}
          alt={nome ? `Foto de ${nome}` : 'Prévia da foto de perfil'}
          tamanho={168}
          borda="amarelo"
        />
        <span className={styles.textoFoto}>Adicione uma foto de perfil</span>
      </label>
      <p id={`${campoId}-dica`} className={styles.dicaFoto}>
        Prévia local: a API ainda não guarda fotos.
      </p>
      {erro && (
        <p className={styles.erroFoto} role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
