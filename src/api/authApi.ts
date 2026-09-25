import axiosClient from "./axiosClient";
import type { LoginRequest } from "../types";

export const login = (data: LoginRequest) =>
  axiosClient.post("api/auth/login", data);