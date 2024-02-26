import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: {},
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsersStore: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export const { updateUsersStore } = usersSlice.actions;
export default usersSlice.reducer;
