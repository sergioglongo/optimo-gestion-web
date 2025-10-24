// project import
// import applications from './applications';
// import widget from './widget';
// import formsTables from './forms-tables';
// import samplePage from './sample-page';
// import chartsMap from './charts-map';
// import other from './other';
// import pages from './pages';
import home from './home';
import parametros from './parametros';
// import parameters from './parameters';

// types
import { NavItemType } from 'types/menu';
import egresos from './egresos';
import expensas from './expensas';
// import samplePage from './sample-page';
import configuracion from './configuracion';
import movimientos from './movimientos';
export { configuracion };
// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [home, expensas, egresos, movimientos, parametros]
};

export default menuItems;
