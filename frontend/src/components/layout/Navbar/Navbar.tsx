import { Context } from "../../../context/functionsContext";
import { Link } from "react-router-dom";

import { useCallback, useContext, useEffect } from "react";

import styles from "./Navbar.module.css";

import Logo from "../../../assets/img/logo.png";
import UserFoto from "../../../assets/img/user.png";

import ImgRounded from "../ImgRounded/ImgRounded";
import { useUser } from "../../../context/UserContext";

function Navbar() {
  const { authenticated, logout, getUser } = useContext(Context);
  const { userLogged, setUserLogged } = useUser();

  const fetchUser = useCallback(async () => {
    await getUser().then((response: any) => {
      setUserLogged(response);
    });
  }, [getUser, setUserLogged])

  useEffect(() => {
    fetchUser()
  }, [fetchUser]);

  const imageSrc = userLogged && userLogged.image ? userLogged.image : UserFoto;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Logo" />
        <h2>Get A Pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <div className={styles.perfil}>
              <ImgRounded
                 src={
                  userLogged && userLogged.imagePreview
                    ? URL.createObjectURL(userLogged.imagePreview)
                    : imageSrc
                }
                alt={userLogged?.name}
                width="px1"
              />
              <div>
                <Link to={`/profile/${userLogged?.id}`}>Meu Perfil</Link>
                <p onClick={logout}>Sair</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/create">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
