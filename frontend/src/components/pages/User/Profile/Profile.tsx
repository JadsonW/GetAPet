import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Context } from "../../../../context/functionsContext";
import { Link, useParams } from "react-router-dom";

import { useUser } from "../../../../context/UserContext";

import ImgRounded from "../../../layout/ImgRounded/ImgRounded";
import Input from "../../../form/Input/Input";
import Modal from "../../../layout/Modal";

import UserFoto from "../../../../assets/img/user.png";
import petFoto from "../../../../assets/img/logo.png";

import styles from "./Profile.module.css";
import { title } from "process";

interface User {
  id: string;
  name?: string;
  phone?: string;
  image?: string;
  email?: string;
  password?: string;
  imagePreview?: string;
}

interface Pet {
  id?: number;
  name?: string;
  color?: string;
  weight?: string;
  age?: string;
  images?: any[];
  imagePreview?: File;
}

interface PetImage {
  petId?: number;
  id: number;
  name: string;
  src: string;
  createdAt: string;
  updatedAt: string;
}

interface Visit {
  adopter: User;
  adopterId: number;
  confirmed: boolean;
  createdAt: string;
  data: string;
  description: string;
  id: number;
  local: string;
  owner: User;
  ownerId: number;
  pet: {
    owner: User;
    pet: Pet;
    petImages: PetImage[];
  };
  petId: string;
  time: string;
  updatedAt: string;
}

function Profile() {
  const { id } = useParams();
  const {
    getUserById,
    getUser,
    updateUser,
    getPetByUser,
    createdPet,
    deletePet,
    getAllVisitsByUser,
    cancelVisit,
    concludeAdoption,
  } = useContext(Context);
  const { userLogged, setUserLogged } = useUser();
  const [user, setUser] = useState<User | undefined>();
  const [visible, setVisible] = useState(false);
  const [visibleModalPet, setVisibleModalPet] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsImage, setPetsImage] = useState<PetImage[]>([]);
  const [pet, setPet] = useState<Pet | undefined>();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitSelected, setVisitSelected] = useState<Visit | undefined>();
  const [visibleModalVisit, setVisibleModalVisit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conclude, setConclude] = useState(false);
  const [emailAdoption, setEmailAdoption] = useState<any>();

  const fetchVisits = useCallback(async () => {
    const data = await getAllVisitsByUser(id);
    setVisits(data);
  }, [getAllVisitsByUser, id]);

  const fetchUser = useCallback(async () => {
    const response = await getUserById(id);
    setUser(response);
  }, [id, getUserById]);

  const fetchUserLogged = useCallback(async () => {
    const response = await getUser();
    setUserLogged(response);
  }, [getUser, setUserLogged]);

  const fetchPetByUser = useCallback(async () => {
    const response = await getPetByUser();
    setPets(response.pets);
    setPetsImage(response.petImages);
  }, [getPetByUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchVisits();
      await fetchUser();
      await fetchPetByUser();
      await fetchUserLogged();
      setLoading(false);
    };
    fetchData();
  }, [fetchUser, fetchPetByUser, fetchUserLogged, fetchVisits]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserLogged({ ...userLogged, [e.target.name]: e.target.value });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setUserLogged({ ...user, imagePreview: file, [e.target.name]: file });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(userLogged).forEach((key) => {
      if (key === "imagePreview") return;
      formData.append(key, (userLogged as any)[key] ?? "");
    });

    await updateUser(formData);
    setVisible(false);
  };

  const handleChangePet = (e: ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const onFileChangePet = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setPet({ ...pet, images: newImages, imagePreview: files[0] });
    }
  };

  const handleSubmitPet = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const form = new FormData();

      Object.keys(pet as Pet).forEach((key) => {
        if (key === "imagePreview") return;
        if (key === "images") {
          for (let i = 0; i < (pet as any)[key].length; i++) {
            form.append("images", (pet as any)[key][i]);
          }
        } else {
          form.append(key, (pet as any)[key]);
        }
      });

      const petCreate = await createdPet(form);
      petCreate.imagePreview = pet?.imagePreview;
      setPets([...pets, petCreate]);
      setVisibleModalPet(false);
    } catch (error) {
      console.log("Erro no handleSubmitPet: ", error);
    }
  };

  const deletedPet = async (id: number) => {
    const updatedPets = pets.filter((pet: Pet) => pet.id !== id);
    setPets(updatedPets);
    await deletePet(id);
  };

  const cancelVisitByPet = async (id: number) => {
    await cancelVisit(id);
    const updatedVisits = visits.filter((visit: Visit) => visit.id !== id);
    setVisits(updatedVisits);
  };

  const handleChangeEmailAdoption = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailAdoption({ [e.target.name]: e.target.value });
  };

  const concluAdoption = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(visitSelected?.petId);
    await concludeAdoption(visitSelected?.petId, emailAdoption);
    setConclude(false)
  };

  const imageSrc = user && user.image ? user.image : UserFoto;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      {userLogged?.id === user?.id ? (
        <>
          <div className={styles.header}>
            <div className={styles.images}>
              <ImgRounded
                src={
                  userLogged.imagePreview
                    ? URL.createObjectURL(userLogged.imagePreview)
                    : imageSrc
                }
                alt={userLogged?.name}
                width="px10"
              />
            </div>

            <div>
              <div className={styles.info}>
                <h1>Informações</h1>
                <div className={styles.bodyInfo}>
                  <span>
                    <h3>Nome: </h3>
                    <p>{userLogged?.name}</p>
                  </span>
                  <span>
                    <h3>Email: </h3>
                    <p>{userLogged?.email}</p>
                  </span>
                  <span>
                    <h3>Telefone: </h3>
                    <p>{userLogged?.phone}</p>
                  </span>
                  <span>
                    <h3>Senha: </h3>
                    <p>***</p>
                  </span>
                </div>
                {user?.id === userLogged?.id && (
                  <button
                    className={styles.button}
                    onClick={() => setVisible(true)}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <ul className={styles.main}>
              <li>
                <h1>Meus pets</h1>
                <div className={styles.bodyVisits}>
                  {pets.length > 0 ? (
                    <ul className={styles.containerCard}>
                      {pets.map((pet: Pet) => {
                        const petImage = petsImage.find(
                          (img) => img.petId === pet.id
                        );
                        const image = petImage ? petImage.src : petFoto;
                        return (
                          <li key={pet.id}>
                            <div>
                              <div className={styles.perfilPet}>
                                <ImgRounded
                                  src={
                                    pet.imagePreview
                                      ? URL.createObjectURL(pet.imagePreview)
                                      : image
                                  }
                                  alt={userLogged?.name}
                                  width="px1"
                                />
                                <h4>{pet.name}</h4>
                              </div>
                              <div className={styles.buttonGroup}>
                                <Link to={`/pet/${pet.id}`}>
                                  <button
                                    className={`${styles.buttonPet} ${styles.vizualize}`}
                                  >
                                    Vizualizar
                                  </button>
                                </Link>
                                <input
                                  type="button"
                                  value="Excluir"
                                  className={`${styles.buttonPet} ${styles.exclude}`}
                                  onClick={() => deletedPet(pet.id!)}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className={styles.containerCard}>
                      <h3>Você ainda não possui pets</h3>
                      <button
                        className={styles.button}
                        onClick={() => setVisibleModalPet(true)}
                      >
                        Cadastrar pet
                      </button>
                    </div>
                  )}
                  <button
                    className={styles.button}
                    onClick={() => setVisibleModalPet(true)}
                  >
                    Cadastrar pet
                  </button>
                </div>
              </li>

              <li>
                <h1>Minhas visitas</h1>
                <div className={styles.bodyVisits}>
                  <ul className={styles.containerCard}>
                    {visits.length > 0 ? (
                      visits.map((visit: Visit, index: number) => {
                        if (!visit.confirmed) {
                          return undefined;
                        }
                        const image = visit.pet?.petImages[0]
                          ? visit.pet?.petImages[0].src
                          : petFoto;
                        return (
                          <div key={index} className={styles.visitaPet}>
                            <div className={styles.visitaPetPerfil}>
                              <ImgRounded
                                src={image}
                                alt={userLogged?.name}
                                width="px1"
                              />
                              <h4>{visit.pet?.pet?.name}</h4>
                            </div>

                            <div className={styles.buttonGroupVisit}>
                              <button
                                className={`${styles.buttonPet} ${styles.vizualize}`}
                                onClick={() => {
                                  setVisitSelected(visit);
                                  setVisibleModalVisit(true);
                                }}
                              >
                                Vizualizar
                              </button>
                              <button
                                className={`${styles.button}`}
                                onClick={() => {
                                  setVisitSelected(visit);
                                  setConclude(true);
                                }}
                              >
                                Concluir adoção
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>Nenhuma visita encontrada</p>
                    )}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.images}>
              <ImgRounded
                src={
                  userLogged.imagePreview
                    ? URL.createObjectURL(userLogged.imagePreview)
                    : imageSrc
                }
                alt={userLogged?.name}
                width="px10"
              />
            </div>

            <div>
              <div className={styles.info}>
                <h1>Informações</h1>
                <div className={styles.bodyInfo}>
                  <span>
                    <h3>Nome: </h3>
                    <p>{user?.name}</p>
                  </span>
                  <span>
                    <h3>Email: </h3>
                    <p>{user?.email}</p>
                  </span>
                  <span>
                    <h3>Telefone: </h3>
                    <p>{user?.phone}</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {visible && (
        <Modal visible={visible} title="Editar">
          <form onSubmit={handleSubmit} className={styles.form_edit}>
            <Input
              text="Image"
              type="file"
              name="image"
              handleOnChange={onFileChange}
            />
            <Input
              text="Nome"
              type="text"
              name="name"
              placeholder="Digite seu nome"
              handleOnChange={handleChange}
              value={userLogged?.name}
            />
            <Input
              text="Telefone"
              type="text"
              name="phone"
              placeholder="Digite seu telefone"
              handleOnChange={handleChange}
              value={userLogged?.phone}
            />
            <Input
              text="Email"
              type="email"
              name="email"
              placeholder="Digite seu email"
              handleOnChange={handleChange}
              value={userLogged?.email}
            />
            <Input
              text="Senha"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              handleOnChange={handleChange}
              value={userLogged?.password}
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
              value="Cancelar"
              className={styles.buttonCLose}
              onClick={() => setVisible(false)}
            />
          </form>
        </Modal>
      )}
      {visibleModalPet && (
        <Modal visible={visibleModalPet} title="Cadastrar pet">
          <form onSubmit={handleSubmitPet} className={styles.form_edit}>
            <Input
              text="Imagens"
              type="file"
              name="images"
              handleOnChange={onFileChangePet}
              multiple={true}
            />
            <Input
              text="Nome"
              type="text"
              name="name"
              placeholder="Digite o nome do pet"
              handleOnChange={handleChangePet}
            />
            <Input
              text="Idade"
              type="text"
              name="age"
              placeholder="Digite a idade do pet + a unidade de medida(anos, meses)"
              handleOnChange={handleChangePet}
            />
            <Input
              text="Peso"
              type="text"
              name="weight"
              placeholder="Digite o peso do pet + a unidade de medida(kg, gramas)"
              handleOnChange={handleChangePet}
            />
            <Input
              text="Cor"
              type="text"
              name="color"
              placeholder="Digite a cor do pet"
              handleOnChange={handleChangePet}
            />
            <Input
              text="Tipo do pet"
              type="text"
              name="type"
              placeholder="Digite o tipo do pet"
              handleOnChange={handleChangePet}
            />
            <input type="submit" value="Cadastrar" className={styles.button} />
            <input
              type="button"
              value="Cancelar"
              className={styles.buttonCLose}
              onClick={() => setVisibleModalPet(false)}
            />
          </form>
        </Modal>
      )}
      {visibleModalVisit && (
        <Modal
          title={`Visita com ${visitSelected?.adopter.name}`}
          key={visitSelected?.id}
          visible={visibleModalVisit}
        >
          <span>
            <h3>Pet:</h3>
            <p>{visitSelected?.pet.pet.name}</p>
          </span>
          <span>
            <h3>Local:</h3>
            <p>{visitSelected?.local}</p>
          </span>
          <span className={styles.visitaPetMain}>
            <h4>Data:</h4>
            <p>{new Date(visitSelected!.data).toLocaleDateString("pt-BR")}</p>
          </span>
          <span>
            <h3>Horario:</h3>
            <p>{visitSelected?.time}</p>
          </span>
          <span>
            <h3>Criador:</h3>
            <p>{visitSelected?.pet?.owner.name}</p>
          </span>
          <span>
            <h3>Descrição de {visitSelected?.pet?.owner.name}:</h3>
            <p>{visitSelected?.description}</p>
          </span>
          <div className={styles.buttonGroupVisit}>
            <input
              type="submit"
              value="Ok"
              className={styles.button}
              onClick={() => setVisibleModalVisit(false)}
            />
            <input
              type="button"
              value="Cancelar visita"
              className={`${styles.buttonCLose} ${styles.exclude}`}
              onClick={() => {
                setVisibleModalVisit(false);
                cancelVisitByPet(visitSelected!.id);
              }}
            />
          </div>
        </Modal>
      )}
      {conclude && (
        <Modal title="Concluindo adoção" visible={conclude}>
          <form onSubmit={concluAdoption} action="">
            <Input
              text="Email"
              type="text"
              placeholder="Adicione o email do adotante"
              name="email"
              handleOnChange={handleChangeEmailAdoption}
            />
            <input type="submit" value="Concluir" className={styles.button} />
            <input
              type="button"
              value="Cancelar"
              className={styles.buttonCLose}
              onClick={() => setConclude(false)}
            />
          </form>
        </Modal>
      )}
    </section>
  );
}

export default Profile;
