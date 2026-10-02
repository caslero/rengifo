import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nueva calle
export const crearCalle = createAsyncThunk(
  "calle/crearCalle",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("/api/calles/crear-calle", data.nuevaCalle);

      const calleCreada = response.data.calles;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));

      return calleCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
