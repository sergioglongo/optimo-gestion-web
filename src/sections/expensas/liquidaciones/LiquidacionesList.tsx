import { ColumnDef } from '@tanstack/react-table';
import { Tooltip } from '@mui/material';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Liquidacion } from 'types/liquidacion'; // Asumiendo que existe

interface Props {
  data: Liquidacion[];
  columns: ColumnDef<Liquidacion>[];
  modalToggler: () => void;
  isAddDisabled?: boolean;
  addDisabledTooltip?: string;
}

// ==============================|| LIQUIDACIONES - LIST ||============================== //

function LiquidacionesList({ data, columns, modalToggler, isAddDisabled, addDisabledTooltip }: Props) {
  return (
    <Tooltip title={isAddDisabled ? addDisabledTooltip : ''} placement="top">
      <TablaAdmin
        data={data}
        columns={columns}
        onAdd={modalToggler}
        addLabel="Nueva Liquidación"
        title="Gestiona las Liquidaciones del consorcio"
        isAddDisabled={isAddDisabled}
      />
    </Tooltip>
  );
}

export default LiquidacionesList;
