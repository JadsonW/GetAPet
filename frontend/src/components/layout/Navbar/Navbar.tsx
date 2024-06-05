import { Context } from "../../../context/UserContext";
import { Link } from "react-router-dom";

import api from "../../../utils/api";

import { useContext, useEffect, useState } from "react";

import styles from "./Navbar.module.css";

import Logo from "../../../assets/img/logo.png";
import UserFoto from "../../../assets/img/user.png";

import ImgRounded from "../ImgRounded/ImgRounded";

interface User {
  name: string;
  image: any;
}

function Navbar() {
  const { authenticated, logout, getUser } = useContext(Context);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser().then((response: any) => {
      setUser(response);
    });
  }, [getUser]);
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
        <li>
          <Link to="/user/mypets">Meus pets</Link>
        </li>
            <div className={styles.perfil}>
              {user?.image ? (
                <ImgRounded src={user.image} alt={user.name} width="px1" />
              ) : (
                <ImgRounded src={UserFoto} alt={user?.name} width="px1" />
              )}
              <div>
                <Link to={"/profile"}>Meu Perfil</Link>
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
