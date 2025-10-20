import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  openedItem: 'dashboard',
  openedComponent: 'buttons',
  openedHorizontalItem: null,
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true,
  isThemeLoading: false
};

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openedItem = action.payload.openedItem;
    },

    activeComponent(state, action) {
      state.openedComponent = action.payload.openedComponent;
    },

    openDashboardDrawer(state, action) {
      state.isDashboardDrawerOpened = action.payload.isDashboardDrawerOpened;
    },

    openComponentDrawer(state, action) {
      state.isComponentDrawerOpened = action.payload.isComponentDrawerOpened;
    },

    activeHorizontalItem(state, action) {
      state.openedHorizontalItem = action.payload.openedHorizontalItem;
    },

    setThemeLoading(state, action: PayloadAction<boolean>) {
      state.isThemeLoading = action.payload;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openComponentDrawer, openDashboardDrawer, activeHorizontalItem, setThemeLoading } =
  menu.actions;
