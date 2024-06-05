import { useContext, useState } from "react";

import { Context } from "../../../context/UserContext";

import Input from "../../form/Input/Input";
import { Link } from "react-router-dom";

import styles from "../../form/Form.module.css";

function Login() {
  const [user, setUser] = useState<Object>({});
  const { login } = useContext(Context);

  function handleChange(e: any) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Email"
          type="text"
          name="email"
          placeholder="Digite seu email"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Não tem conta? <Link to="/create">Clique aqui!</Link>
      </p>
    </section>
  );
}

export default Login;
