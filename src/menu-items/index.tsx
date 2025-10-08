// project import
// import applications from './applications';
// import widget from './widget';
// import formsTables from './forms-tables';
// import samplePage from './sample-page';
// import chartsMap from './charts-map';
// import other from './other';
// import pages from './pages';
import home from './home';
import consorcio from './consorcio';
// import parameters from './parameters';

// types
import { NavItemType } from 'types/menu';
import proveedores from './proveedores';
import movimientos from './movimientos';
import expensas from './expensas';
// import samplePage from './sample-page';
import parameters from './parameters';
export { parameters };
// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [home, expensas, movimientos, proveedores, consorcio]
};

export default menuItems;
