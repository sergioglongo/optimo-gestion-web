// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { FaSlidersH } from 'react-icons/fa';

// type
import { NavItemType } from 'types/menu';

// icons
import { FaCity } from 'react-icons/fa';

// ==============================|| MENU ITEMS - PARAMETERS ||============================== //

const configuracionColapsable: NavItemType = {
  id: 'configuracion-collapse',
  title: <FormattedMessage id="configurations" />,
  type: 'collapse',
  icon: FaSlidersH, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'consorcios',
      title: <FormattedMessage id="Consorcios" />,
      type: 'item',
      url: '/configuracion/consorcios',
      icon: FaCity
    }
  ]
};

const configuracion: NavItemType = {
  id: 'group-configuracion',
  // title: <FormattedMessage id="configurations" />,
  icon: FaSlidersH,
  type: 'group',
  children: [configuracionColapsable] // Now contains the collapsible menu
};

export default configuracion;
