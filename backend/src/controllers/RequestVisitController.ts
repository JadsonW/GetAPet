import { Request, Response } from "express";

//models
import RequestVisit, {
  requestVisitAttributes,
} from "../database/Models/RequestVisit";
import Pet from "../database/Models/Pet";

//helpers
import getToken from "../helpers/getToken";
import getUserByToken from "../helpers/getUserByToken";

class RequestVisitController {
  public async createReqtVisit(req: Request, res: Response) {
    try {
      const petId = req.params.petid;

      const token = await getToken(req, res);
      const adopter = await getUserByToken(token, res);

      if (!adopter) {
        return res
          .status(422)
          .json({ message: "Faça login para completar a ação" });
      }

      const pet = await Pet.findOne({ where: { id: petId } });

      if (!pet) {
        return res.status(422).json({ message: "Pet não encontrado!" });
      }

      if (adopter.id === pet.userId) {
        return res.status(401).json({
          message:
            "Você não pode criar uma solicitação de visita para seu proprio pet!",
        });
      }

      const requestVisitData: requestVisitAttributes = {
        petId: pet.id,
        adopterId: adopter.id,
      };

      await RequestVisit.create(requestVisitData);

      return res
        .status(200)
        .json({ message: "Solicitação enviada ao dono do pet!" });
    } catch (error) {
      console.log("erro no envio da solicitação", error);
    }
  }

  public async deleteReqtVisit(req: Request, res: Response) {
    const id = req.params.id;

    const reqVisit = await RequestVisit.findOne({ where: { id: id } });

    if (!reqVisit) {
      return res.status(422).json({ message: "Solicitação não encontrada!" });
    }

    await reqVisit.destroy();
    return res.status(200).json({ message: "Solicitação deletada!" });
  }

  public async getAllReqVisit(req: Request, res: Response) {
    const token = await getToken(req, res);
    const user = await getUserByToken(token, res);

    if (!user) {
      return;
    }

    //buscando todas as requisições de visitas
    const reqs = await RequestVisit.findAll();

    if (!reqs) {
      return res.json({ message: "Nenhuma solicitação de adoção encontrada" });
    }

    let reqsOwner: Array<Object> = [];

    //verificando se existe alguma visita para o usuario logado
    for (const req of reqs) {
      const pet = await Pet.findOne({ where: { id: req.petId } });
      if (pet && pet.userId === user.id) {
        reqsOwner.push(req);
      }
    }

    return res.status(200).json({ reqsOwner });
  }
}

export default new RequestVisitController();
