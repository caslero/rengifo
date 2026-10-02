import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las calles con manejo de errores
export const fetchCalles = createAsyncThunk(
  "calles/fetchCalles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/calles/todas-calles");
      return response.data.calles;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener las calles",
      );
    }
  },
);
