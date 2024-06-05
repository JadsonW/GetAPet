import { useContext, useEffect, useState } from "react";
import { Context } from "../../../context/UserContext";
import { useParams } from "react-router-dom";

import ImgRounded from "../../layout/ImgRounded/ImgRounded";

import petFoto from "../../../assets/img/logo.png";

import styles from "./PetProfile.module.css";

interface Pet {
  id: any;
  name: string;
  userId: any;
  age: string;
  weight: string;
  color: string;
  adopterId: string;
}

interface Images {
  id: number;
  src: string;
  petId: number;
}

function PetProfile() {
  const { getPet } = useContext(Context);
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | undefined>();
  const [petImages, setPetImages] = useState<Images[]>();

  useEffect(() => {
    getPet(id).then((response: any) => {
      setPet(response.pet);
      setPetImages(response.petImages);
    });
  }, [getPet, id]);

  const imageSrc =
    petImages && petImages.length > 0 ? petImages[0].src : petFoto;

  return (
    <section>
      <div>
        <ImgRounded src={imageSrc} alt={pet?.name} width="px10" />
        <h1>{pet?.name}</h1>
      </div>
    </section>
  );
}

export default PetProfile;
