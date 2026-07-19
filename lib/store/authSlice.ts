import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CandidateSummary } from "../api/auth";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  candidate: CandidateSummary | null;
}

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  candidate: CandidateSummary;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  candidate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<SessionPayload>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.candidate = action.payload.candidate;
    },
    clearSession(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.candidate = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
