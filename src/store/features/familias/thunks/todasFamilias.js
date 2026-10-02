import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las familias con manejo de errores
export const fetchFamilias = createAsyncThunk(
  "familias/fetchFamilias",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/familias/todas-familias");
      return response.data.familias;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener las familias",
      );
    }
  },
);
