// project import
import applications from './applications';
import widget from './widget';
// import formsTables from './forms-tables';
// import samplePage from './sample-page';
// import chartsMap from './charts-map';
// import other from './other';
// import pages from './pages';
import home from './home';
import parameters from './parameters';

// types
import { NavItemType } from 'types/menu';
// import samplePage from './sample-page';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [home, widget, applications, parameters]
};

export default menuItems;
