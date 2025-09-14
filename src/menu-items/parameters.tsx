// third-party
import { FormattedMessage } from 'react-intl';

// project-imports

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

const parameters: NavItemType = {
  id: 'group-parameters',
  title: <FormattedMessage id="parameters" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.MessageOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'cuentas',
      title: <FormattedMessage id="Cuentas" />,
      type: 'item',
      url: '/parameters/cuentas',
      icon: DollarOutlined
      // breadcrumbs: false
    },
    {
      id: 'consorcios',
      title: <FormattedMessage id="Consorcios" />,
      type: 'item',
      url: '/parameters/consorcios',
      icon: HddOutlined
      // breadcrumbs: false
    }
  ]
};

export default parameters;
