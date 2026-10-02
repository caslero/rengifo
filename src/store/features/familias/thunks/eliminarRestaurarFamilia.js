import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarFamilia = createAsyncThunk(
  "familias/eliminarRestaurarFamilia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/familias/${!data.estado ? "eliminar" : "restaurar"}-familia`,
        {
          id_familia: data.id_familia,
          estado: data.estado,
        },
      );

      return response?.data?.familias;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} familia`,
      );
    }
  },
);
