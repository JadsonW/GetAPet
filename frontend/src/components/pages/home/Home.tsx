import { useContext, useEffect, useState } from "react";
import { Context } from "../../../context/UserContext";

import ImgRounded from "../../layout/ImgRounded/ImgRounded";
import petFoto from "../../../assets/img/logo.png";

import styles from "./Home.module.css";
import { Link } from "react-router-dom";

interface Pets {
  id: any;
  name: string;
  userId: any;
  image: string;
  age: string;
  weight: string;
  color: string;
  adopterId: string;
}

interface Image {
  petId: any;
  name: string;
  src: string;
}

function Home() {
  const { getAllPets } = useContext(Context);
  const [pets, setPets] = useState<Pets[]>([]);
  const [petsImage, setPetsImage] = useState<Image[]>([]);

  useEffect(() => {
    getAllPets()
      .then((response: any) => {
        if (Array.isArray(response.pets) && Array.isArray(response.petsImage)) {
          setPets(response.pets);
          setPetsImage(response.petsImage);
        } else {
          console.error("getAllPets response is not an array", response);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching pets", error);
      });
  }, [getAllPets]);

  return (
    <section className={styles.container}>
      <h1>Pets disponiveis</h1>
      <ul>
        {pets.map((pet: any) => {
          if (!pet.available) {
            return;
          }
          const image = petsImage.find((img) => img.petId === pet.id);
          return (
            <li>
              {image ? (
                <ImgRounded src={image.src} alt={pet.name} width="px10" />
              ) : (
                <ImgRounded src={petFoto} alt={pet.name} width="px10" />
              )}
              <span>
                <h2>{pet.name}</h2>
                <button>
                  <Link to={`/pet/${pet.id}`}>Saber mais</Link>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Home;
