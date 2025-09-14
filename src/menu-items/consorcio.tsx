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
  DollarOutlined,
  TeamOutlined,
  ShopOutlined,
  HomeOutlined,
  DashboardOutlined // Added DashboardOutlined
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
  DashboardOutlined // Added DashboardOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const consorcioColapsable: NavItemType = {
  id: 'consorcio-collapse',
  title: <FormattedMessage id="Consorcios" />,
  type: 'collapse',
  icon: icons.AppstoreAddOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'cuentas',
      title: <FormattedMessage id="Cuentas" />,
      type: 'item',
      url: '/consorcio/cuentas',
      icon: DollarOutlined
    },
    {
      id: 'proveedores',
      title: <FormattedMessage id="Provider" />,
      type: 'item',
      url: '/consorcio/proveedores',
      icon: ShopOutlined
    },
    {
      id: 'personas',
      title: <FormattedMessage id="Personas" />,
      type: 'item',
      url: '/consorcio/personas',
      icon: TeamOutlined
    },
    {
      id: 'unidades',
      title: <FormattedMessage id="unidad-operativa" />,
      type: 'item',
      url: '/consorcio/unidades-operativas', // Corrected URL to match MainRoutes
      icon: HomeOutlined
    }
  ]
};

const consorcio: NavItemType = {
  id: 'group-consorcio',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [consorcioColapsable] // Now contains the collapsible menu
};

export default consorcio;
