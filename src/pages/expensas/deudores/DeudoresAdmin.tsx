import { useMemo, useState } from 'react';

// material-ui
import { Typography, Grid, Button, CircularProgress } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';

// project import
import MainCard from 'components/MainCard';
import DeudoresList from 'sections/expensas/deudores/DeudoresList';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetDeudoresQuery, useGetAllDeudores } from 'services/api/liquidacionUnidadapi';

// types
import { DeudorLiquidacionUnidad, LiquidacionUnidadDeudores } from 'types/liquidacion';

// assets
import { ReloadOutlined } from '@ant-design/icons';

// sections
import DeudorPagoModal from 'sections/expensas/deudores/DeudorPagoModal';

// ==============================|| DEUDORES - ADMIN ||============================== //

const DeudoresAdmin = () => {
  const { selectedConsorcio } = useConsorcio();

  const { data: deudoresData = [], isLoading: isLoadingDeudores } = useGetDeudoresQuery(selectedConsorcio?.id, {
    enabled: !!selectedConsorcio?.id
  });

  const { mutate: getAllDeudores, isLoading: isGeneratingDeudores } = useGetAllDeudores();

  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [deudaAPagar, setDeudaAPagar] = useState<DeudorLiquidacionUnidad | null>(null);
  const [unidadFuncionalId, setunidadFuncionalId] = useState<number | null>(null);

  const handleRefresh = () => {
    if (selectedConsorcio?.id) {
      getAllDeudores(selectedConsorcio.id);
    }
  };

  const handleOpenPagoModal = (deuda: DeudorLiquidacionUnidad, idUnidad: number) => {
    setDeudaAPagar(deuda);
    setunidadFuncionalId(idUnidad);
    setPagoModalOpen(true);
  };

  const columns = useMemo<ColumnDef<LiquidacionUnidadDeudores>[]>(
    () => [
      {
        header: 'Unidad',
        accessorKey: 'etiqueta'
      },
      {
        header: 'Deudor',
        // Usamos accessorFn para crear un valor de búsqueda combinando apellido y nombre.
        accessorFn: (row) => (row.Deudor ? `${row.Deudor.apellido} ${row.Deudor.nombre}` : 'No asignado'),
        // El 'cell' ahora puede simplemente obtener el valor generado por accessorFn.
        cell: ({ getValue }) => <Typography>{getValue() as string}</Typography>
      },
      {
        header: 'Periodos',
        accessorKey: 'LiquidacionUnidads',
        cell: ({ getValue }) => <Typography>{(getValue() as any[]).length}</Typography>
      },
      {
        header: 'Deuda Total',
        accessorKey: 'total_deuda',
        cell: ({ getValue }) => (
          <Typography color="error" fontWeight="bold">
            ${Number(getValue()).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }
    ],
    []
  );

  const isLoading = isLoadingDeudores || isGeneratingDeudores;

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h5">Administración de Deudores</Typography>
            </Grid>
            <Grid item xs={12} sm={4} container justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={isGeneratingDeudores ? <CircularProgress size={20} color="inherit" /> : <ReloadOutlined />}
                onClick={handleRefresh}
                disabled={!selectedConsorcio || isGeneratingDeudores}
              >
                Actualizar Lista
              </Button>
            </Grid>
          </Grid>
        }
        content={false}
      >
        <DeudoresList data={deudoresData} columns={columns} isLoading={isLoading} onPay={handleOpenPagoModal} />
      </MainCard>
      <DeudorPagoModal open={pagoModalOpen} modalToggler={setPagoModalOpen} deuda={deudaAPagar} unidadFuncionalId={unidadFuncionalId} />
    </>
  );
};

export default DeudoresAdmin;
