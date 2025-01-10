import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './slices/userSlice'; // Example slice

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persist Config
const persistConfig = {
  key: 'root',
  storage,
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable checks for non-serializable data in persist
    }),
});

// Export types for use in the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
