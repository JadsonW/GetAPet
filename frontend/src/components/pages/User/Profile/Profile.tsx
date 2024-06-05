import { useContext, useEffect, useState } from "react";
import { Context } from "../../../../context/UserContext";

import ImgRounded from "../../../layout/ImgRounded/ImgRounded";
import Input from "../../../form/Input/Input";
import Modal from "../../../layout/Modal";

import UserFoto from "../../../../assets/img/user.png";

import styles from "./Profile.module.css";
import { Link } from "react-router-dom";

interface User {
  name: string;
  phone: string;
  image: string;
  email: string;
  password: string;
}

function Profile() {
  const { getUser, updateUser } = useContext(Context);
  const [user, setUser] = useState<any>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getUser().then((response: any) => {
      setUser(response);
    });
  }, [getUser]);

  function handleChange(e: any) {
    setUser({ ...user, [e.target.name]: e.target.value } as User);
  }

  function onFihleChange(e: any) {
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, user[key] ?? "");
    });

    await updateUser(formData);
    setVisible(false);
    window.location.reload();
  }

  const imageSrc = user && user.image ? user.image : UserFoto;

  return (
    <section>
      <div className={styles.header}>
        <ImgRounded src={imageSrc} alt={user?.name} width="px10" />
        <h1>Eu</h1>
      </div>
      <div>
        <h1>Informações</h1>
        <div className={styles.info}>
          <div>
            <span>
              <h4>Nome: </h4>
              <p>{user?.name}</p>
            </span>
            <span>
              <h4>Email: </h4>
              <p>{user?.email}</p>
            </span>
            <span>
              <h4>Telefone: </h4>
              <p>{user?.phone}</p>
            </span>
            <span>
              <h4>Senha: </h4>
              <p>***</p>
            </span>
          </div>
          <button
            className={styles.button}
            onClick={() => {
              setVisible(true);
            }}
          >
            Editar
          </button>
        </div>

        {visible && (
          <Modal visible={visible}>
            <form onSubmit={handleSubmit} className={styles.form_edit}>
              <Input
                text="Image"
                type="file"
                name="image"
                handleOnChange={onFihleChange}
              />
              <Input
                text="Nome"
                type="text"
                name="name"
                placeholder="Digite seu nome"
                handleOnChange={handleChange}
                value={user?.name}
              />
              <Input
                text="Telefone"
                type="text"
                name="phone"
                placeholder="Digite seu telefone"
                handleOnChange={handleChange}
                value={user?.phone}
              />
              <Input
                text="Email"
                type="email"
                name="email"
                placeholder="Digite seu email"
                handleOnChange={handleChange}
                value={user?.email}
              />
              <Input
                text="Senha"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                handleOnChange={handleChange}
                value={user?.password}
              />
              <Input
                text="Confirme sua senha"
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                handleOnChange={handleChange}
              />
              <input type="submit" value="Editar" className={styles.button} />
              <input
                type="button"
                value={"Cancelar"}
                className={styles.buttonCLose}
                onClick={() => {
                  setVisible(false);
                }}
              />
            </form>
          </Modal>
        )}
      </div>
    </section>
  );
}

export default Profile;
