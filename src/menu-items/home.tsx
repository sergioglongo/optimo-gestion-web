// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { HomeOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  HomeOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const home: NavItemType = {
  id: 'home',
  title: <FormattedMessage id="Home" />,
  type: 'group',
  url: '/home',
  icon: icons.HomeOutlined
};

export default home;
