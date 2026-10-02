// features/calles/callesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchCalles } from "@/store/features/calles/thunks/todasCalles";
import { crearCalle } from "@/store/features/calles/thunks/crearCalle";
import { eliminarRestaurarCalle } from "./thunks/eliminarRestaurarCalle";
import { actualizarCalle } from "./thunks/actualizarCalle";

const callesSlice = createSlice({
  name: "calles",
  initialState: {
    calles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCalles
      .addCase(fetchCalles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalles.fulfilled, (state, action) => {
        state.loading = false;
        state.calles = action.payload;
      })
      .addCase(fetchCalles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // crearCalle
      .addCase(crearCalle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCalle.fulfilled, (state, action) => {
        state.loading = false;
        state.calles.push(action.payload);
      })
      .addCase(crearCalle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarCalle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarCalle.fulfilled, (state, action) => {
        state.loading = false;
        const calleActualizada = action.payload;

        const index = state.calles.findIndex(
          (c) => c.id === calleActualizada.id,
        );
        if (index !== -1) {
          state.calles[index] = calleActualizada;
        }
      })
      .addCase(eliminarRestaurarCalle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarCalle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCalle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.calles.findIndex(
          (calle) => calle.id === action.payload.id,
        );
        if (index !== -1) {
          state.calles[index] = action.payload;
        }
      })
      .addCase(actualizarCalle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default callesSlice.reducer;
