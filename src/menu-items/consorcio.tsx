import { FormattedMessage } from 'react-intl';

// assets
import { HomeOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';
import { FaLandmark } from 'react-icons/fa';
import { FaRegBuilding } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa';
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const consorcioColapsable: NavItemType = {
  id: 'consorcio-collapse',
  title: <FormattedMessage id="Consorcio" />,
  type: 'collapse',
  icon: FaCity, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'cuentas',
      title: <FormattedMessage id="Cuentas" />,
      type: 'item',
      url: '/consorcio/cuentas',
      icon: FaLandmark
    },
    {
      id: 'personas',
      title: <FormattedMessage id="Personas" />,
      type: 'item',
      url: '/consorcio/personas',
      icon: FaUsers
    },
    {
      id: 'unidades',
      title: <FormattedMessage id="functional-units" />,
      type: 'item',
      url: '/consorcio/unidades', // Corrected URL to match MainRoutes
      icon: FaRegBuilding
    },
    {
      id: 'tipounidades',
      title: <FormattedMessage id="operative-units-types" />,
      type: 'item',
      url: '/consorcio/tipo-unidades', // Corrected URL to match MainRoutes
      icon: HomeOutlined
    },
    {
      id: 'rubros',
      title: <FormattedMessage id="Categories" />,
      type: 'item',
      url: '/consorcio/rubros', // Corrected URL to match MainRoutes
      icon: FaLayerGroup
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
