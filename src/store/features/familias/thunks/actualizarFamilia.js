import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva familia con manejo de errores
export const actualizarFamilia = createAsyncThunk(
  "familias/actualizarFamilia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/familias/actualizar-datos-familia",
        data.updateFamilia,
      );

      const familiaUpdate = response.data.familias;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return familiaUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
