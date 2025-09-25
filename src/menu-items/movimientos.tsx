import { FormattedMessage } from 'react-intl';

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined,
  ToolOutlined,
  DollarOutlined,
  DashboardOutlined, // Added DashboardOutlined
  ApartmentOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  ToolOutlined,
  DollarOutlined // Added DashboardOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const movimientosColapsable: NavItemType = {
  id: 'movimientos-collapse',
  title: <FormattedMessage id="Transactions" />,
  type: 'collapse',
  icon: icons.ToolOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'movimientos',
      title: <FormattedMessage id="Expenses" />,
      type: 'item',
      url: '/movimientos/gastos',
      icon: ToolOutlined
    },
    {
      id: 'conciliacion',
      title: <FormattedMessage id="Reconciliation" />,
      type: 'item',
      url: '/movimientos/conciliacion',
      icon: DollarOutlined
    }
  ]
};

const movimientos: NavItemType = {
  id: 'group-movimientos',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [movimientosColapsable] // Now contains the collapsible menu
};

export default movimientos;
