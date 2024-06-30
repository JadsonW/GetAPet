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
    if (!token) {
      console.log("Usuario não está logado");
    } else {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
      console.log("Usuario logado");
    }
  }, [token]);

  async function register(user: User) {
    let msgText = "Cadastro realizado com sucesso!";
    let msgType = "success";
    try {
      const data = await api.post("/user/create", user).then((response) => {
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

  function logout() {
    let msgText = "logout realizado com sucesso!";
    let msgType = "success";

    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined!;

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
        return;
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
      console.log("O erro é no getUser:", error);
    }
  }

  async function getUserById(id: string) {
    try {
      const data = await api.get(`/user/${id}`).then((response) => {
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

    let msgText = "Usuario editado com sucesso!";
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

      const userOwner = await api
        .get(`user/${data.pet.userId}`)
        .then((response) => {
          return response.data;
        });

      const images = data.petImages;

      if (images) {
        images.forEach((image: any) => {
          const imgRoute = `${process.env.REACT_APP_API}public/images/pets/${image.name}`;
          image.src = imgRoute;
        });
      }

      return {
        pet: data.pet,
        petImages: data.petImages,
        owner: userOwner,
      };
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
          const imgRoute = `${process.env.REACT_APP_API}public/images/pets/${image.name}`;
          image.src = imgRoute;
        });
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function createdPet(Pet: any) {
    let msgText = "Pet criado com sucesso";
    let msgType = "sucess";
    try {
      const data = await api
        .post("/pets/create", Pet, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token!)}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response.data;
        });

      return data.petCreate;
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.error(error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function deletePet(id: string) {
    let msgText = "Pet deletado com sucesso!";
    let msgType = "success";
    try {
      const data = await api
        .delete(`/pets/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token!)}`,
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

  async function editPet(Pet: any, id: string) {
    let msgText = "Pet editado com sucesso!";
    let msgType = "success";
    try {
      await api.patch(`pets/update/${id}`, Pet, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token!)}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.log(error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function reqVisit(id: string) {
    let msgType = "success";
    try {
      const data = await api.post(`/request/create/${id}`).then((response) => {
        return response.data;
      });

      setFlashMessage({ msg: data.message, type: msgType });
      return data;
    } catch (error: any) {
      console.log(error);
      let msg = error.response.data.message;
      msgType = "error";
      setFlashMessage({ msg: msg, type: msgType });
    }
  }

  async function getAllReqVisitsByPet(id: string) {
    try {
      const data = await api.get(`/request/allReqs/${id}`).then((Response) => {
        return Response.data;
      });

      return data.reqs;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteReqVisit(id: string) {
    try {
      const data = await api
        .delete(`/request/delete/${id}`)
        .then((response) => {
          return response.data;
        });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function scheduleVisit(id: string, dataForm: any) {
    let msgType;
    let msgText;
    try {
      const data = await api
        .post(`/schedule/create/${id}`, dataForm)
        .then((response) => {
          return response.data;
        });
      msgType = "success";
      msgText = data.message;
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  async function getAllVisitsByUser(id: string) {
    try {
      const data = await api
        .get(`/schedule/myvisits/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token!)}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response.data;
        });

      const visits = data.visits;

      visits.forEach(async (visit: any) => {
        const adopter = await getUserById(visit.adopterId);
        const pet = await getPet(visit.petId);
        visit.adopter = adopter;
        visit.pet = pet;
      });

      return data.visits;
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllVisitsByPet(id: string) {
    try {
      const data = await api
        .get(`/schedule/petvisits/${id}`)
        .then((response) => {
          return response.data;
        });

      const visits = data.visits;

      visits.forEach(async (visit: any) => {
        const adopter = await getUserById(visit.adopterId);
        const pet = await getPet(visit.petId);
        visit.adopter = adopter;
        visit.pet = pet;
      });

      return data.visits;
    } catch (error) {
      console.log(error);
    }
  }

  async function concludeAdoption(id: string, email: string) {
    let msgType = "success";
    let msgText;
    console.log('------->: ', email);
  
    try {
      const data = await api
        .patch(`/pets/conclude/${id}`, email)
        .then((response) => {
          return response.data;
        });
  
      msgText = data.message;
    } catch (error: any) {
      console.log(error);
      msgText = error.response.data.message;
      msgType = "error";
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }
  
  async function cancelVisit(id: string) {
    let msgText = "";
    let msgType = "success";

    try {
      const data = await api
        .patch(`/schedule/disconfirm/${id}`)
        .then((response) => {
          return response.data;
        });
      msgText = data.message;
      return data;
    } catch (error: any) {
      msgText = error.response.data.message;
      msgType = "error";
      console.log("Error no ngc aqi", error);
    }
    setFlashMessage({ msg: msgText, type: msgType });
  }

  return {
    authenticated,
    register,
    login,
    logout,
    getUser,
    getUserById,
    getAllPets,
    getPet,
    updateUser,
    getPetByUser,
    createdPet,
    deletePet,
    editPet,
    reqVisit,
    getAllReqVisitsByPet,
    deleteReqVisit,
    scheduleVisit,
    getAllVisitsByUser,
    getAllVisitsByPet,
    cancelVisit,
    concludeAdoption,
  };
}
