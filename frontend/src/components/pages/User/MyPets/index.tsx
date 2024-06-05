import { useContext, useEffect, useState } from "react";
import { Context } from "../../../../context/UserContext";
import { Link } from "react-router-dom";

import ImgRounded from "../../../layout/ImgRounded/ImgRounded";
import petFoto from "../../../../assets/img/logo.png";

import styles from './index.module.css'

function MyPets() {
  const { getPetByUser } = useContext(Context);
  const [pets, setPets] = useState<any>(null);
  const [petsImage, setPetsImage] = useState<any[]>([]);

  useEffect(() => {
    getPetByUser().then((response: any) => {
      setPets(response.pets);
      setPetsImage(response.petImages);
    });
  }, [getPetByUser]);

  return (
    <section className={styles.container}>
      <h1>Meus pets</h1>
      {pets ? (
         <ul>
         {pets.map((pet: any) => {
           const image = petsImage ? petsImage.find((img) => img.petId === pet.id) : null;
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
      ) : (
        <h1>Você ainda não possui pets cadastrados</h1>
      )}
    </section>
  );
}

export default MyPets;
