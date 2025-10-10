// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { FaSlidersH } from 'react-icons/fa';

// type
import { NavItemType } from 'types/menu';

// icons
import { FaCity } from 'react-icons/fa';

// ==============================|| MENU ITEMS - PARAMETERS ||============================== //

const parametersColapsable: NavItemType = {
  id: 'parameters-collapse',
  title: <FormattedMessage id="parameters" />,
  type: 'collapse',
  icon: FaSlidersH, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'consorcios',
      title: <FormattedMessage id="Consorcios" />,
      type: 'item',
      url: '/parameters/consorcios',
      icon: FaCity
    }
  ]
};

const parameters: NavItemType = {
  id: 'group-parameters',
  // title: <FormattedMessage id="parameters" />,
  icon: FaSlidersH,
  type: 'group',
  children: [parametersColapsable] // Now contains the collapsible menu
};

export default parameters;
