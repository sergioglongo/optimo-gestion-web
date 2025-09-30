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
  DatabaseOutlined,
  MenuUnfoldOutlined,
  SplitCellsOutlined
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
  MenuUnfoldOutlined,
  DollarOutlined // Added DashboardOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const movimientosColapsable: NavItemType = {
  id: 'movimientos-collapse',
  title: <FormattedMessage id="Transactions" />,
  type: 'collapse',
  icon: icons.MenuUnfoldOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'gastos',
      title: <FormattedMessage id="Expenses" />,
      type: 'item',
      url: '/movimientos/gastos',
      icon: ToolOutlined
    },
    {
      id: 'transacciones',
      title: <FormattedMessage id="transaction" />,
      type: 'item',
      url: '/movimientos/transacciones',
      icon: SplitCellsOutlined
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
