import { configureStore } from "@reduxjs/toolkit";

import rolesReducer from "@/store/features/roles/rolesSlices";
import usuariosReducer from "@/store/features/usuarios/usuariosSlices";
import authReducer from "@/store/features/auth/authSlice";
import modalReducer from "@/store/features/modal/slicesModal";
import formsReducer from "@/store/features/formularios/formSlices";
import callesReducer from "@/store/features/calles/callesSlices";
import familiasReducer from "@/store/features/familias/familiasSlices";

import comunasReducer from "@/store/features/comunas/comunasSlices";
import vocerosReducer from "@/store/features/voceros/vocerosSlices";

const store = configureStore({
  reducer: {
    roles: rolesReducer,
    usuarios: usuariosReducer,
    auth: authReducer,
    modal: modalReducer,
    forms: formsReducer,
    calles: callesReducer,
    familias: familiasReducer,
    comunas: comunasReducer,
    voceros: vocerosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para redux-persist
    }),
});

export default store;
