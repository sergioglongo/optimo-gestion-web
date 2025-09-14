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
  HddOutlined,
  DollarOutlined
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
  LinkOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const consorcio: NavItemType = {
  id: 'group-consorcio',
  title: <FormattedMessage id="parameters" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
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
      icon: HddOutlined
    }
  ]
};

export default consorcio;
