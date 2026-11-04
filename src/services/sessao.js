/** Único ponto de acesso ao localStorage. Pode falhar em janelas privadas ou com site data bloqueado. */
const CHAVE_PERFIL = 'perfil';
const CHAVE_USUARIO = 'usuarioId';

function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor));
  } catch {
    // Sem armazenamento, o app segue funcionando só nesta aba.
  }
}

export const lerPerfil = () => ler(CHAVE_PERFIL);
export const salvarPerfil = (perfil) => gravar(CHAVE_PERFIL, perfil);

export const lerUsuarioId = () => ler(CHAVE_USUARIO);
export const salvarUsuarioId = (id) => gravar(CHAVE_USUARIO, id);
