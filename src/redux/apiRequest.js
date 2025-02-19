import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import { getUsersFailed, getUsersStart, getUsersSuccess } from "./userSlice";
import axiosInstance from "../config/axios/axiosInstance";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("/Accounts/Login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
    return res.data;
  } catch (err) {
    dispatch(loginFailed());
    throw err;
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axiosInstance.post("/Accounts/Register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get("/api/Accounts/Users", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
  }
};

export const logOut = async (dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post("", id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logoutFailed());
  }
};
