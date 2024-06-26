import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import * as Yup from "yup";
import * as bcrypt from "bcrypt";

//Model
import User, { userAttributes } from "../database/Models/User";

//helpers
import createToken from "../helpers/createToken";
import getToken from "../helpers/getToken";
import getUserByToken from "../helpers/getUserByToken";

import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET!;

class UserController {
  public async createdUser(req: Request, res: Response) {
    try {
      //Pegando os dados do requisição
      const { name, phone, email, password, confirmPassword } = req.body;

      //Validação do formulario
      const schema = Yup.object().shape({
        confirmPassword: Yup.string().required("Confirme sua senha!"),
        password: Yup.string().required("A senha é obrigatoria!"),
        email: Yup.string()
          .email("Coloque um email valido!")
          .required("O email é obrigatorio!"),
        phone: Yup.string().required("O numero de telefone é obrigatorio!"),
        name: Yup.string().required("O nome é obrigatorio!"),
      });

      await schema.validate(req.body, { abortEarly: true });

      //Verificando email
      const userExists = await User.findOne({ where: { email: email } });
      if (userExists) {
        return res.status(422).json({ message: "O email já está em uso!" });
      }

      if (confirmPassword !== password) {
        return res.status(422).json({ message: "As senhas não coincidem!" });
      }

      //Criptografando a senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const userData: userAttributes = {
        name: name,
        phone: phone,
        email: email,
        password: passwordHash,
      };

      const user = await User.create(userData);
      await createToken(req, user, res);
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

  public async getUserById(req: Request, res: Response) {
    const id = req.params.id;

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(422).json({ message: "Usuario não encontrado!" });
    }

    user.password;

    return res.status(200).json(user);
  }

  public async updatedUser(req: Request, res: Response) {
    try {
      const { name, phone, email, password, confirmPassword } = req.body;
      let image: any;

      //Validação do formulario
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email("Coloque um email valido!"),
        phone: Yup.string(),
        password: Yup.string(),
        confirmPassword: Yup.string(),
      });

      await schema.validate(req.body, { abortEarly: true });

      if (req.file) {
        image = req.file.filename;
      }

      const userData: userAttributes = {
        name: name,
        phone: phone,
        email: email,
        password,
        image: image,
      };

      if (password && confirmPassword) {
        if (password != confirmPassword) {
          res.status(422).json({ error: "As senhas não conferem." });
        } else if (password === confirmPassword && password != null) {
          //Criptografando a senha
          const salt = await bcrypt.genSalt(12);
          const passwordHash = await bcrypt.hash(password, salt);
          userData.password = passwordHash;
        }
      }

      //pegando o usuario
      const token = getToken(req, res);
      const user = await getUserByToken(token, res);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      await User.update(userData, { where: { id: user.id } });

      res.status(200).json({ message: "Usuario editado", userData });
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

  public async removeUser(req: Request, res: Response) {
    const id = req.params.id;

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(422).json({ message: "Usuario não encontrado" });
    }

    await user.destroy();
    res.status(200).json({ message: "Usuario removido!" });
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const schema = Yup.object().shape({
        password: Yup.string().required("a Senha é obrigatoria!"),
        email: Yup.string().email().required("O email é obrigatorio"),
      });

      await schema.validate(req.body, { abortEarly: true });

      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(422).json({ message: "Usuario não cadastrado!" });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(422).json({ message: "Senha incorreta" });
      }

      await createToken(req, user, res);
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

  public async checkUser(req: Request, res: Response) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req, res);
      const decoded = verify(token, secret) as JwtPayload;

      currentUser = await User.findByPk(decoded.id);
    } else {
      currentUser = null;
    }
    return res.status(200).send(currentUser);
  }
}

export default new UserController();
