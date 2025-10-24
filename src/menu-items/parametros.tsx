import { FormattedMessage } from 'react-intl';

// assets
import { HomeOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';
import { FaDolly, FaLandmark } from 'react-icons/fa';
import { FaRegBuilding } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa';
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const parametrosColapsable: NavItemType = {
  id: 'parametros-collapse',
  title: <FormattedMessage id="parameters" />,
  type: 'collapse',
  icon: FaCity, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'cuentas',
      title: <FormattedMessage id="Cuentas" />,
      type: 'item',
      url: '/parametros/cuentas',
      icon: FaLandmark
    },
    {
      id: 'personas',
      title: <FormattedMessage id="Personas" />,
      type: 'item',
      url: '/parametros/personas',
      icon: FaUsers
    },
    {
      id: 'proveedores',
      title: <FormattedMessage id="Providers" />,
      type: 'item',
      url: '/parametros/proveedores',
      icon: FaDolly
    },
    {
      id: 'unidades',
      title: <FormattedMessage id="functional-units" />,
      type: 'item',
      url: '/parametros/unidades', // Corrected URL to match MainRoutes
      icon: FaRegBuilding
    },
    {
      id: 'tipounidades',
      title: <FormattedMessage id="operative-units-types" />,
      type: 'item',
      url: '/parametros/tipo-unidades', // Corrected URL to match MainRoutes
      icon: HomeOutlined
    },
    {
      id: 'rubros',
      title: <FormattedMessage id="Categories" />,
      type: 'item',
      url: '/parametros/rubros', // Corrected URL to match MainRoutes
      icon: FaLayerGroup
    }
  ]
};

const parametros: NavItemType = {
  id: 'group-parametros',
  // title: <FormattedMessage id="parameters" />,
  type: 'group',
  children: [parametrosColapsable] // Now contains the collapsible menu
};

export default parametros;
