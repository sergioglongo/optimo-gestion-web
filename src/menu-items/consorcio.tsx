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
  DashboardOutlined, // Added DashboardOutlined
  AppstoreOutlined,
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
  ApartmentOutlined // Added DashboardOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const consorcioColapsable: NavItemType = {
  id: 'consorcio-collapse',
  title: <FormattedMessage id="Consorcio" />,
  type: 'collapse',
  icon: icons.DatabaseOutlined, // Using AppstoreAddOutlined as the main icon
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
      title: <FormattedMessage id="Providers" />,
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
      title: <FormattedMessage id="unidades-operativas" />,
      type: 'item',
      url: '/consorcio/unidades', // Corrected URL to match MainRoutes
      icon: HomeOutlined
    },
    {
      id: 'rubros',
      title: <FormattedMessage id="Categories" />,
      type: 'item',
      url: '/consorcio/rubros', // Corrected URL to match MainRoutes
      icon: AppstoreOutlined
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
