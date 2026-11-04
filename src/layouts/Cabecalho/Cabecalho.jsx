import { useEffect, useId, useState } from 'react';
import { Link, NavLink } from 'react-router';
import logoBbts from '@/assets/images/LogoBBTS.png';
import { Avatar, Button } from '@/components/ui';
import { cx } from '@/utils/classes';
import styles from './Cabecalho.module.css';

/**
 * Barra azul com o logo amarelo, o separador e o nome da página.
 * Sem `links`, mostra só a marca, como no cadastro público.
 */
export default function Cabecalho({ titulo, links, usuario }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navId = useId();

  useEffect(() => {
    if (!menuAberto) return undefined;

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') setMenuAberto(false);
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [menuAberto]);

  return (
    <header className={styles.cabecalho} data-surface="primary">
      <div className={styles.barra}>
        <div className={styles.marca}>
          <Link to="/" className={styles.logo}>
            <img src={logoBbts} alt="BB Tecnologia e Serviços" width="967" height="84" />
            <span className="sr-only">, ir para a seleção de perfil</span>
          </Link>
          <p className={styles.pagina}>
            <span aria-hidden="true">|</span> {titulo}
          </p>
        </div>

        {links && (
          <>
            <div className={styles.acoes}>
              {usuario && (
                <Avatar src={usuario.foto} alt={`Foto de ${usuario.nome}`} borda="amarelo" />
              )}
              <Button
                variante="inverso"
                icone={menuAberto ? 'fechar' : 'menu'}
                somenteIcone
                className={styles.botaoMenu}
                aria-expanded={menuAberto}
                aria-controls={navId}
                onClick={() => setMenuAberto((aberto) => !aberto)}
              >
                {menuAberto ? 'Fechar menu' : 'Abrir menu'}
              </Button>
            </div>

            <nav
              id={navId}
              className={cx(styles.nav, menuAberto && styles.navAberta)}
              aria-label="Navegação principal"
            >
              <ul className={styles.links}>
                {links.map(({ para, rotulo, exato }) => (
                  <li key={rotulo}>
                    <NavLink
                      to={para}
                      end={exato}
                      viewTransition
                      className={({ isActive }) => cx(styles.link, isActive && styles.linkAtivo)}
                      onClick={() => setMenuAberto(false)}
                    >
                      {rotulo}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
