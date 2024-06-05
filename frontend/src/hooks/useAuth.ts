// api
import api from "../utils/api";

import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";
import { useNavigate } from "react-router-dom";

interface User {
  [key: string]: any;
}

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const parsedToken = JSON.parse(token);
      api.defaults.headers.Authorization = `Bearer ${parsedToken}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user: User) {
    let msgText = "Cadastro realizado com sucesso!";
    let msgType = "success";
    try {
      const data = await api.post("/user/create", user).then((response) => {
        return response.data;
      });

      await authUser(data.token);
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.log(error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  function logout() {
    let msgText = "logout realizado com sucesso!";
    let msgType = "success";

    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined!;

    console.log(
      authenticated,
      "----------------------",
      localStorage.getItem("token")
    );
    navigate("/");

    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function login(user: User) {
    let msgText = "login realizado com sucesso!";
    let msgType = "success";

    try {
      const data = await api.post("/user/login", user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.log(error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function authUser(data: any) {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
  }

  async function getUser() {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        return undefined;
      }
      const data = await api
        .get(`/user/checkuser`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then((response) => {
          return response.data;
        });

      let image = data.image;
      if (image) {
        const img = `${process.env.REACT_APP_API}public/images/users/${image}`;
        data.image = img;
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser(user: any) {
    const token = localStorage.getItem("token");

    let msgText = "Usuari editado com sucesso!";
    let msgType = "success";
    try {
      console.log(user);
      const data = api
        .patch("/user/edit", user, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token!)}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response.data;
        });

      return data;
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.log(error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function getAllPets() {
    try {
      const data = await api.get("/pets/").then((response) => {
        return response.data;
      });

      await data.petsImage.map((image: any) => {
        const imgRoute = `${process.env.REACT_APP_API}public/images/pets/${image.name}`;
        image.src = imgRoute;
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getPet(id: string) {
    try {
      const data = await api.get(`pets/${id}`).then((response) => {
        return response.data;
      });

      const images = data.petImages;

      if (images) {
        images.map((image: any) => {
          const imgRoute = `${process.env.REACT_APP_API}public/images/pets/${image.name}`;
          image.src = imgRoute;
        });
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getPetByUser() {
    try {
      const data = await api
        .get("pets/mypets", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token!)}`,
          },
        })
        .then((response) => {
          return response.data;
        });

        const images = data.petImages;

        if (images) {
          images.map((image: any) => {
            console.log(image.name)
            const imgRoute = `${process.env.REACT_APP_API}public/images/pets/${image.name}`;
            image.src = imgRoute;
          });
        }

        return data
    } catch (error) {
      console.log(error);
    }
  }

  return {
    authenticated,
    register,
    login,
    logout,
    getUser,
    getAllPets,
    getPet,
    updateUser,
    getPetByUser
  };
}
