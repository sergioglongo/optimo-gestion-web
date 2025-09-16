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
  DatabaseOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined,
  HddOutlined
};

// ==============================|| MENU ITEMS - PARAMETERS ||============================== //

const parametersColapsable: NavItemType = {
  id: 'parameters-collapse',
  title: <FormattedMessage id="parameters" />,
  type: 'collapse',
  icon: icons.AppstoreAddOutlined, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'consorcios',
      title: <FormattedMessage id="Consorcios" />,
      type: 'item',
      url: '/parameters/consorcios',
      icon: icons.DatabaseOutlined
    }
  ]
};

const parameters: NavItemType = {
  id: 'group-parameters',
  // title: <FormattedMessage id="parameters" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [parametersColapsable] // Now contains the collapsible menu
};

export default parameters;
