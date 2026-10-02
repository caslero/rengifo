import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nueva familias
export const crearFamilia = createAsyncThunk(
  "familias/crearFamilia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/familias/crear-familia",
        data.nuevaFamilia,
      );

      const FamiliasCreada = response.data.familias;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));

      return FamiliasCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
