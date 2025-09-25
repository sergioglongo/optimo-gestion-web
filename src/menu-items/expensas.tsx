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

const expensasColapsable: NavItemType = {
  id: 'expensas-collapse',
  title: <FormattedMessage id="Fees" />,
  type: 'collapse',
  icon: icons.ToolOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'expensas',
      title: <FormattedMessage id="Statement" />,
      type: 'item',
      url: '/expensas/liquidaciones',
      icon: ToolOutlined
    },
    {
      id: 'cobranzas',
      title: <FormattedMessage id="Incomes" />,
      type: 'item',
      url: '/expensas/cobranzas',
      icon: DollarOutlined
    },
    {
      id: 'Deudores',
      title: <FormattedMessage id="overdue-list" />,
      type: 'item',
      url: '/expensas/deudores',
      icon: DollarOutlined
    }
  ]
};

const expensas: NavItemType = {
  id: 'group-expensas',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [expensasColapsable] // Now contains the collapsible menu
};

export default expensas;
