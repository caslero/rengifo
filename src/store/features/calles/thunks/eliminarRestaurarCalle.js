import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarCalle = createAsyncThunk(
  "calles/eliminarRestaurarCalle",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/calles/${!data.estado ? "eliminar" : "restaurar"}-calle`,
        {
          id_calle: data.id_calle,
          estado: data.estado,
        },
      );

      return response?.data?.calles;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} calle`,
      );
    }
  },
);
