import { Request, Response } from "express";

import * as Yup from "yup";

//Models
import Pet, { petAttributes } from "../database/Models/Pet";
import User from "../database/Models/User";
import PetImage, { petImageAttribute } from "../database/Models/PetImage";

//Helpers
import getUserByToken from "../helpers/getUserByToken";
import getToken from "../helpers/getToken";
import Visit from "../database/Models/Visit";
import { where } from "sequelize";

class PetController {
  public async create(req: Request, res: Response) {
    try {
      const { name, age, weight, color, type } = req.body;
      let images: any;

      const schema = Yup.object().shape({
        type: Yup.string().required("Digite o tipo do pet!"),
        color: Yup.string().required("A cor do pet é obrigatoria!"),
        weight: Yup.string().required("O peso do pet é obrigatorio!"),
        age: Yup.string().required("A idade do pet é obrigatoria"),
        name: Yup.string().required("O nome do pet é obrigatorio!"),
      });

      await schema.validate(req.body, { abortEarly: true });
      const token: string = getToken(req, res);
      const user: User | null = await getUserByToken(token, res);

      if (!user) {
        return res
          .status(422)
          .json({ message: "Faça login para completar a ação!" });
      }

      const petData: petAttributes = {
        name: name,
        age: age,
        weight: weight,
        color: color,
        type: type,
        available: true,
        userId: user.id,
      };

      const petCreate = await Pet.create(petData);

      if (req.files) {
        images = req.files;
        images.forEach(async (image: any) => {
          const petImageData: petImageAttribute = {
            name: image.filename,
            petId: petCreate.id,
          };
          await PetImage.create(petImageData);
        });
      }

      return res
        .status(201)
        .json({ petCreate });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const yupErrors = error.message;
        return res.status(422).json({ message: error.message });
      } else {
        // Erro interno do servidor
        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }

  public async remove(req: Request, res: Response) {
    const id = req.params.id;

    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(422).json({ message: "Pet não encontrado!" });
      }

    const visits = await Visit.findAll({where: {petId: pet.id}})

    if(visits) {
      visits.forEach((visit) => {
        visit.destroy()
      })
    }

    const petImages = await PetImage.findAll({ where: { petId: pet.id } });

    if (petImages) {
      await Promise.all(
        petImages.map((Petimage) => {
          Petimage.destroy();
        })
      );
    }

    pet.destroy();
    return res.status(200).json({ message: "Usuario deletado com sucesso!" });
  }

  public async update(req: Request, res: Response) {
    try {
      const { name, age, weight, color } = req.body;
      const id: number = parseInt(req.params.id);

      let images: any;

      const schema = Yup.object().shape({
        color: Yup.string(),
        weight: Yup.string(),
        age: Yup.string(),
        name: Yup.string(),
      });

      await schema.validate(req.body, { abortEarly: true });

      const token: string = getToken(req, res);
      const user: User | null = await getUserByToken(token, res);

      if (!user) {
        return res
          .status(422)
          .json({ message: "Faça login para completar a ação!" });
      }

      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(422).json({ message: "Pet não encontrado" });
      }

      const petData: petAttributes = {
        name: name,
        age: age,
        weight: weight,
        color: color,
      };

      const petUpdate = await pet.update(petData, {
        where: { id: id },
      });
      console.log("------------<>", req.files);

      if (req.files) {
        images = req.files;
        images.map(async (image: any) => {
          const petImageData: petImageAttribute = {
            name: image.filename,
            petId: petUpdate.id,
          };
          await PetImage.destroy({ where: { petId: id } });
          await PetImage.create(petImageData);
        });
      }
      return res
        .status(200)
        .json({ message: "Pet editado com sucesso", petUpdate });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const yupErrors = error.message;
        return res.status(422).json({ message: error.message });
      } else {
        // Erro interno do servidor
        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }

  public async getPetById(req: Request, res: Response) {
    const id = req.params.id;

    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(422).json({ message: "Pet não cadastrado!" });
    }

    const petImages = await PetImage.findAll({ where: { petId: pet.id } });

    return res.status(200).json({ pet, petImages });
  }

  public async getAll(req: Request, res: Response) {
    const pets = await Pet.findAll();
    const petsImage = await PetImage.findAll();

    if (!pets) {
      return res.status(422).json({ message: "Nenhum pet cadastrado" });
    }

    return res.status(200).json({ pets, petsImage });
  }

  public async getAllUserPets(req: Request, res: Response) {
    const token = getToken(req, res);
    const user = await getUserByToken(token, res);

    if (!user) {
      return res.status(401).json({ message: "Acesso negado djabo!" });
    }

    const pets = await Pet.findAll({ where: { userId: user.id, available: true } });

    const petImagesPromises = pets.map((pet) => {
      return PetImage.findAll({ where: { petId: pet.id } });
    });

    const petImagesArrays = await Promise.all(petImagesPromises);
    const petImages = petImagesArrays.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );

    return res.status(200).json({ pets, petImages });
  }

  public async getAllUserAdoptions(req: Request, res: Response) {
    const token = getToken(req, res);
    const user = await getUserByToken(token, res);

    if (!user) {
      return res.status(401).json({ message: "Acesso negado!" });
    }

    const pets = await Pet.findAll({
      where: { adopterID: user.id },
    });

    return res.status(200).json({ pets });
  }

  public async adoptPet(req: Request, res: Response) {
    console.log('============> body: ', req.body)
    const petId = req.params.petId;
    const adopterEmail = req.body.email;

    const visits = await Visit.findAll({ where: { petId: petId } });

    if (!visit) {
      return;
    }

    const pet = await Pet.findByPk(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    if (!pet.available) {
      return res.status(503).json({ message: "Pet ja adotado!" });
    }

    const adopter = await User.findOne({ where: { email: adopterEmail } });

    if (!adopter) {
      return res.status(404).json({
        message: `Usuario com email '${adopterEmail}' não encontrado`,
      });
    }

    const petData: petAttributes = {
      adopterID: adopter.id,
      available: false,
    };

    await pet.update(petData);
    visits.forEach((visit) => {
      visit.destroy()
    })

    return res
      .status(200)
      .json({ message: "Parabéns a adoção do pet foi concluida!" });
  }
}

export default new PetController();
