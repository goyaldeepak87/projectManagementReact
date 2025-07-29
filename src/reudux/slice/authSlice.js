// src/redux/slice/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/v1/auth/register', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Network error. Please try again.' });
    }
  }
);

// Member Verify & Join (Invite Accept + Register)
export const memberVerifyJoin = createAsyncThunk(
  'auth/memberVerifyJoin',
  async (credentials , { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/v1/auth/project-invite/verify-email`, credentials);

      // ✅ Save token in localStorage (same as login)
      localStorage.setItem('token', response.data.data.result.tokens.access.token);
      return response.data.data.result;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Network error. Please try again.' });
    }
  }
);

// export const memberVerifyJoin = createAsyncThunk(
//   'auth/memberVerifyJoin',
//   async (credentials, { rejectWithValue }) => {
//     console.log("credentials", credentials)
//     try {
//       const response = await axios.post('http://localhost:3000/v1/auth/project-invite/verify-email', credentials);
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data);
//       }
//       return rejectWithValue({ message: 'Network error. Please try again.' });
//     }
//   }
// );

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', credentials);
      localStorage.setItem('token', response.data.data.result.tokens.access.token);
      return response.data.data.result;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Network error. Please try again.' });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    tokens: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Member Verify & Join (store like login)
      .addCase(memberVerifyJoin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(memberVerifyJoin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(memberVerifyJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
