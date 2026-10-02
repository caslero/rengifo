import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva calle con manejo de errores
export const actualizarCalle = createAsyncThunk(
  "calles/actualizarCalle",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/calles/actualizar-datos-calle",
        data.updateCalle,
      );

      const calleUpdate = response.data.calles;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return calleUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
