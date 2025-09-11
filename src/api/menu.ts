// project imports
import { dispatch } from 'store';
import { activeItem, activeComponent, openComponentDrawer, openDashboardDrawer, activeHorizontalItem } from 'store/slices/menu';

export function handlerComponentDrawer(isComponentDrawerOpened: boolean) {
  dispatch(openComponentDrawer({ isComponentDrawerOpened }));
}

export function handlerActiveComponent(openedComponent: string) {
  dispatch(activeComponent({ openedComponent }));
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  dispatch(openDashboardDrawer({ isDashboardDrawerOpened }));
}

export function handlerHorizontalActiveItem(openedHorizontalItem: string | null) {
  dispatch(activeHorizontalItem({ openedHorizontalItem }));
}

export function handlerActiveItem(openedItem: string) {
  dispatch(activeItem({ openedItem }));
}
