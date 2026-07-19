import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import dualStorage from "./dualStorage";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer({ key: "jobzshala-candidate-redux", storage: dualStorage, whitelist: ["auth"] }, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable action payloads internally
      // (see its docs) — this is the documented way to silence that check
      // for just those action types, not a blanket opt-out.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
