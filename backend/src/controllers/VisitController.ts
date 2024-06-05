import { Request, Response } from "express";

//Validations
import * as Yup from "yup";

//Models
import Visit, { visitAttributes } from "../database/Models/Visit";
import Pet, { petAttributes } from "../database/Models/Pet";
import User from "../database/Models/User";
import RequestVisit from "../database/Models/RequestVisit";

//Helpers
import getUserByToken from "../helpers/getUserByToken";
import getToken from "../helpers/getToken";

class VisitController {
  public async createVisit(req: Request, res: Response) {
    try {
      const { data, local, time, description } = req.body;
      const reqid = req.params.reqid;

      const validations = Yup.object().shape({
        description: Yup.string(),
        time: Yup.string().required("Informe o horário da visita!"),
        data: Yup.date().required("Informe a data da visita!").nullable(),
        local: Yup.string().required("Informe o local da visita!"),
      });

      await validations.validate(req.body, { abortEarly: true });

      //Buscando a solicitação de visita
      const reqVisit = await RequestVisit.findByPk(reqid);

      //verificando se existe solicitação
      if (!reqVisit) {
        return res.status(422).json({ message: "Solicitação não encontrada!" });
      }

      const pet: Pet | null = await Pet.findByPk(reqVisit.petId);

      if (!pet) {
        return res
          .status(422)
          .json({ message: "Pet não encontrado, tente novament!" });
      }

      const token = await getToken(req, res);
      const user = await getUserByToken(token, res);

      if (!user) {
        return res
          .status(422)
          .json({ message: "Faça login para completar a ação!" });
      }

      if (pet.userId !== user.id) {
        return res
          .status(422)
          .json({ message: "Apenas o dono do pet pode agendar uma visita!" });
      }

      const adopter: User | null = await User.findByPk(reqVisit.adopterId);

      if (!adopter) {
        return res
          .status(422)
          .json({ message: "Adotante não encontrado, tente novament!" });
      }

      if (!adopter) {
        return res.status(422).json({ message: "Acesso negado!" });
      }

      const visitData: visitAttributes = {
        data: data,
        local: local,
        time: time,
        description: description,
        petId: pet.id,
        adopterId: adopter.id,
        ownerId: pet.userId,
        confirmed: true,
      };

      const visitCreate = await Visit.create(visitData);
      await reqVisit.destroy();
      return res.status(200).json({ message: "Visita marcada", visitCreate });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(422).json({ message: error.message });
      } else {
        // Erro interno do servidor
        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }

  public async disconfirm(req: Request, res: Response) {
    try {
      //id da visita
      const id = req.params.id;

      const visit = await Visit.findByPk(id);

      if (!visit) {
        return res.status(422).json({ message: "Visita não encontrada!" });
      }

      const adopter = await User.findByPk(visit.adopterId);
      const owner = await User.findByPk(visit.ownerId);

      if (visit.confirmed === false) {
        return res.json({ message: "Essa visita ja foi cancelada!" });
      }

      const visitUpdate: visitAttributes = {
        confirmed: false,
      };

      await Visit.update(visitUpdate, { where: { id: id } });

      const token = await getToken(req, res);
      const user = await getUserByToken(token, res);

      if (adopter?.id === user!.id) {
        return res.status(200).json({
          message: `A visita foi cancelada, informamos ${owner?.name} sobre o cancelamento.`,
          adopter,
        });
      }

      return res.status(200).json({
        message: `A visita foi cancelada, informamos ${adopter?.name} sobre o cancelamento.`,
        owner,
      });
    } catch (error) {
      console.log("Erro no cancelamento da visita", error);
    }
  }

  public async getVisitByUser(req: Request, res: Response) {
    try {
      const token = await getToken(req, res);
      const user = await getUserByToken(token, res);

      if (!user) {
        return res.status(422).json({ message: "Faça login!" });
      }

      const visitsOwner = await Visit.findAll({ where: { ownerId: user.id } });
      const visitsAdopter = await Visit.findAll({
        where: { adopterId: user.id },
      });
      console.log("rrrr", visitsAdopter);
      console.log("eee", visitsOwner);

      const visits: Array<Object> = [];

      if (visitsOwner) {
        visits.push(visitsOwner);
      }
      if (visitsAdopter) {
        visits.push(visitsAdopter);
      }
      if (!visitsAdopter && !visitsOwner) {
        return res.json({
          message: "Voce não possui visitas agendadas!",
        });
      }

      return res.status(200).json({ visits });
    } catch (error) {
      console.log("Erro na busca as visitas! ", error);
    }
  }
}

export default new VisitController();
