import {
  useContext,
  useEffect,
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { Context } from "../../../context/functionsContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import ImgRounded from "../../layout/ImgRounded/ImgRounded";
import Input from "../../form/Input/Input";
import Modal from "../../layout/Modal";

import petFoto from "../../../assets/img/logo.png";
import userFoto from "../../../assets/img/user.png";

import styles from "./PetProfile.module.css";

import { FaRegTimesCircle } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
interface Pet {
  id: any;
  name: string;
  userId: any;
  images: any[];
  age: string;
  weight: string;
  color: string;
  type: string;
  adopterId: string;
}

interface Images {
  id: number;
  src: string;
  petId: number;
}
interface PetImage {
  petId?: number;
  id: number;
  name: string;
  src: string;
  createdAt: string;
  updatedAt: string;
}
interface User {
  id?: string;
  name?: string;
  phone?: string;
  image?: string;
  email?: string;
}

interface ReqSchedule {
  id: string;
  adopterId: string;
  petId: string;
}

interface Schedule {
  local?: string;
  data?: string;
  time?: string;
  description?: string;
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
  petId: number;
  time: string;
  updatedAt: string;
}

function PetProfile() {
  const { id } = useParams();
  const {
    getPet,
    getUser,
    getUserById,
    editPet,
    reqVisit,
    getAllReqVisitsByPet,
    deleteReqVisit,
    scheduleVisit,
    getAllVisitsByPet,
  } = useContext(Context);
  const [pet, setPet] = useState<Pet | undefined>();
  const [petImages, setPetImages] = useState<Images[]>();
  const [user, setUser] = useState<User | undefined>();
  const [ownerPet, setOwnerPet] = useState<User | undefined>();
  const [visible, setVisible] = useState(false);
  const [visibleReq, setVisibleReq] = useState(false);
  const [reqVisits, setReqVisits] = useState<ReqSchedule[]>([]);
  const [adopters, setAdopters] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<Schedule | undefined>();
  const [idReq, setIdReq] = useState();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitSelected, setVisitSelected] = useState<Visit | undefined>();
  const [visibleModalVisit, setVisibleModalVisit] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVisits = useCallback(async () => {
    const data = await getAllVisitsByPet(id);
    setVisits(data);
  }, [getAllVisitsByPet, id]);

  const fetchUser = useCallback(async () => {
    const response = await getUser();
    setUser(response);
  }, [getUser]);

  const fetchPet = useCallback(async () => {
    const response = await getPet(id);
    setPet(response.pet);
    setPetImages(response.petImages);
    setOwnerPet(response.owner);
  }, [getPet, id]);

  const fetchReqVisits = useCallback(async () => {
    const response = await getAllReqVisitsByPet(id);
    setReqVisits(response);
  }, [getAllReqVisitsByPet, id]);

  const fetchAdopters = useCallback(async () => {
    if (reqVisits && reqVisits.length > 0) {
      const adoptersP = await Promise.all(
        reqVisits.map(async (req: any) => {
          const adopter = await getUserById(req.adopterId);
          return adopter;
        })
      );
      setAdopters(adoptersP);
    }
  }, [reqVisits, getUserById]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchPet();
      await fetchReqVisits();
      await fetchVisits();
      setLoading(false);
    };
    fetchData();
  }, [fetchUser, fetchPet, fetchReqVisits, fetchVisits]);

  useEffect(() => {
    fetchAdopters();
  }, [reqVisits, fetchAdopters]);

  const handleChangePet = async (e: ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, [e.target.name]: e.target.value } as Pet);
  };

  const onFileChangePet = async (e: ChangeEvent<HTMLInputElement>) => {
    if (pet) {
      const files = e.target.files;
      if (files) {
        const newImages = Array.from(files); // Converte o objeto FileList em um array
        setPet({ ...pet, images: newImages });
      }
    }
  };

  const handleSubmitPet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(pet as Pet).forEach((key) => {
      if (key === "imagePreview") {
        return;
      } else if (key === "images") {
        for (let i = 0; i < (pet as any)[key].length; i++) {
          formData.append("images", (pet as any)[key][i]);
        }
      } else {
        formData.append(key, (pet as any)[key]);
      }
    });

    await editPet(formData, pet?.id);
    const response = await getPet(pet?.id);
    setPet(response.pet);
    setPetImages(response.petImages);
    console.log(petImages);
    setOwnerPet(response.owner);
    setVisible(false);
  };

  const deleteReq = async (id: string) => {
    const updatedReq = reqVisits.filter((req) => req.id !== id);
    setReqVisits(updatedReq);
    await deleteReqVisit(id);
  };

  const handleChangeSchedule = async (e: ChangeEvent<HTMLInputElement>) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };

  const handleSubmitSchedule = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      await scheduleVisit(idReq, scheduleData);
      const updatedReqs = reqVisits.filter((req: any) => req.id !== idReq);
      setReqVisits(updatedReqs);
      setVisibleReq(false);
    } catch (error) {
      console.log("Erro no envio do formulario de agendamento: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className={styles.header}>
        <div className={styles.images}>
          {petImages && petImages.length > 0 ? (
            petImages.map((image, index) => (
              <div>
                <ImgRounded
                  key={index}
                  src={image.src}
                  alt={pet?.name}
                  width="px10"
                />
              </div>
            ))
          ) : (
            <ImgRounded src={petFoto} alt={pet?.name} width="px10" />
          )}
        </div>

        <div>
          <div className={styles.info}>
            <h1>Informações</h1>
            <div className={styles.bodyInfo}>
              <span>
                <h3>Nome: </h3>
                <p>{pet?.name}</p>
              </span>
              <span>
                <h3>Peso: </h3>
                <p>{pet?.weight}</p>
              </span>
              <span>
                <h3>Idade: </h3>
                <p>{pet?.age}</p>
              </span>
              <span>
                <h3>Cor: </h3>
                <p>{pet?.color}</p>
              </span>
              <span>
                <h3>Tipo: </h3>
                <p>{pet?.type}</p>
              </span>
              <span>
                <h3>Dono: </h3>
                <p>{ownerPet?.name}</p>
              </span>
            </div>
            {user?.id === pet?.userId ? (
              <button
                className={styles.butt}
                onClick={() => {
                  setVisible(true);
                }}
              >
                Editar
              </button>
            ) : (
              <button className={styles.butt} onClick={() => reqVisit(pet?.id)}>
                Solicitar visita
              </button>
            )}
          </div>
        </div>
      </div>
      <ul className={styles.container_main}>
        {user?.id === pet?.userId && (
          <>
            <li>
              <h1>Visitas solicitadas</h1>
              <div className={styles.bodyVisits}>
                <div className={styles.containerCard}>
                  {reqVisits && reqVisits.length > 0 ? (
                    reqVisits.map((req: any) => {
                      const adopter = adopters.find(
                        (adopter: any) => adopter.id === req.adopterId
                      );
                      return (
                        <div key={req.id} className={styles.reqVisit}>
                          {adopter && (
                            <div className={styles.container_reqVisit}>
                              <div>
                                <ImgRounded
                                  src={adopter.image ? adopter.image : userFoto}
                                  alt={adopter.name}
                                  width="px1"
                                />
                                <h4>
                                  <Link to={`/profile/${adopter?.id}`}>
                                    Visitar Perfil
                                  </Link>
                                </h4>
                              </div>
                              <div>
                                <p>Pet</p>
                                <b>{pet?.name}</b>
                              </div>
                              <span>
                                <button
                                  className={styles.confirm}
                                  onClick={() => {
                                    setIdReq(req.id);
                                    setVisibleReq(true);
                                  }}
                                >
                                  <GiConfirmed />
                                </button>
                                <button
                                  className={styles.esc}
                                  onClick={() => {
                                    deleteReq(req?.id);
                                  }}
                                >
                                  <FaRegTimesCircle />
                                </button>
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>Nenhuma solicitação de visita encontrada</p>
                  )}
                </div>
              </div>
            </li>
            <li>
              <h1>Visitas agendadas</h1>
              <div className={styles.bodyVisits}>
                <div className={styles.containerCard}>
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
                              alt={visit.pet?.pet.name}
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
                              Visualizar
                            </button>
                            <input
                              type="button"
                              value="Cancelar"
                              className={`${styles.buttonPet} ${styles.exclude}`}
                              onClick={() => ""}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Nenhuma visita encontrada</p>
                  )}
                </div>
              </div>
            </li>
          </>
        )}
      </ul>
      {visible && (
        <Modal visible={visible} title="Editar">
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
              value={pet?.name}
            />
            <Input
              text="Idade"
              type="text"
              name="age"
              placeholder="Digite a idade do pet"
              handleOnChange={handleChangePet}
              value={pet?.age}
            />
            <Input
              text="Cor"
              type="text"
              name="color"
              placeholder="Digite a cor do pet"
              handleOnChange={handleChangePet}
              value={pet?.color}
            />
            <Input
              text="Peso"
              type="text"
              name="weight"
              placeholder="Digite o peso do pet"
              handleOnChange={handleChangePet}
              value={pet?.weight}
            />

            <input type="submit" value="Editar" className={styles.butt} />
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
      {visibleReq && (
        <Modal visible={visibleReq} title="Agendar visita">
          <form onSubmit={handleSubmitSchedule} className={styles.form_edit}>
            <Input
              text="Local"
              type="text"
              name="local"
              placeholder="Digite o local do encontro"
              handleOnChange={handleChangeSchedule}
            />
            <Input
              text="Data"
              type="date"
              name="data"
              placeholder="Digite a data do encontro"
              handleOnChange={handleChangeSchedule}
            />
            <Input
              text="Horário"
              type="text"
              name="time"
              placeholder="Digite a hora do encontro"
              handleOnChange={handleChangeSchedule}
            />
            <Input
              text="Descrição"
              type="text"
              name="description"
              placeholder="Area destinada a descrições e ajuda na localização"
              handleOnChange={handleChangeSchedule}
            />
            <input type="submit" value="Agendar" className={styles.butt} />
            <input
              type="button"
              value={"Cancelar"}
              className={styles.buttonCLose}
              onClick={() => {
                setVisibleReq(false);
              }}
            />
          </form>
        </Modal>
      )}
      {visibleModalVisit && (
        <Modal
          title={`Visita com o ${visitSelected?.adopter.name}`}
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
          <input
            type="button"
            value="Ok"
            className={styles.button}
            onClick={() => setVisibleModalVisit(false)}
          />
        </Modal>
      )}
    </section>
  );
}

export default PetProfile;
