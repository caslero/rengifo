// features/familias/familiasSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchFamilias } from "@/store/features/familias/thunks/todasFamilias";
import { crearFamilia } from "@/store/features/familias/thunks/crearFamilia";
import { eliminarRestaurarFamilia } from "@/store/features/familias/thunks/eliminarRestaurarFamilia";
import { actualizarFamilia } from "@/store/features/familias/thunks/actualizarFamilia";

const familiasSlice = createSlice({
  name: "familias",
  initialState: {
    familias: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFamilias
      .addCase(fetchFamilias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilias.fulfilled, (state, action) => {
        state.loading = false;
        state.familias = action.payload;
      })
      .addCase(fetchFamilias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // crearFamilia
      .addCase(crearFamilia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearFamilia.fulfilled, (state, action) => {
        state.loading = false;
        state.familias.push(action.payload);
      })
      .addCase(crearFamilia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarFamilia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarFamilia.fulfilled, (state, action) => {
        state.loading = false;
        const familiasActualizada = action.payload;

        const index = state.familias.findIndex(
          (c) => c.id === familiasActualizada.id,
        );
        if (index !== -1) {
          state.familias[index] = familiasActualizada;
        }
      })
      .addCase(eliminarRestaurarFamilia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarFamilia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarFamilia.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.familias.findIndex(
          (familia) => familia.id === action.payload.id,
        );
        if (index !== -1) {
          state.familias[index] = action.payload;
        }
      })
      .addCase(actualizarFamilia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default familiasSlice.reducer;
