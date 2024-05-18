// api
import api from "../utils/api";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

interface User {
  [key: string]: any;
}

export default function useAuth() {
  async function register(user: User) {
    try {
      const data = await api.post("/user/create", user).then((response) => {
        return response.data;
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  return { register };
}
