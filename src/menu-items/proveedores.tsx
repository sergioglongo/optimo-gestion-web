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

const proveedoresColapsable: NavItemType = {
  id: 'proveedores-collapse',
  title: <FormattedMessage id="Providers" />,
  type: 'collapse',
  icon: icons.ToolOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'proveedores',
      title: <FormattedMessage id="Providers" />,
      type: 'item',
      url: '/proveedores/listado',
      icon: ToolOutlined
    },
    {
      id: 'pagos',
      title: <FormattedMessage id="Payments" />,
      type: 'item',
      url: '/proveedores/pagos',
      icon: DollarOutlined
    }
  ]
};

const proveedores: NavItemType = {
  id: 'group-proveedores',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [proveedoresColapsable] // Now contains the collapsible menu
};

export default proveedores;
