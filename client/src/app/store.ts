import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import noteSlice from '../reducers/noteSlice';

export const store = configureStore({
  reducer: {
    notes: noteSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
