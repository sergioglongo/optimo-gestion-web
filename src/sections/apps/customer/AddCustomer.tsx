import { useEffect, useMemo, useState, useCallback } from 'react';

// material-ui
import { Box, Modal, Stack } from '@mui/material';

// project-imports
import FormCustomerAdd from './FormCustomerAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetCustomers } from 'api/customer';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { closeCustomerModal } from 'store/slices/customer';

// types
import { CustomerList } from 'types/customer';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

const AddCustomer = () => {
  const dispatch = useAppDispatch();
  const { open, customerId } = useAppSelector((state) => state.customer);
  // Solo ejecuta la consulta si el modal está abierto y es para editar un cliente
  const { data: customers, isLoading } = useGetCustomers({ enabled: open && !!customerId });

  const [list, setList] = useState<CustomerList | null>(null);

  useEffect(() => {
    if (customerId && customers) {
      const selectedCustomer = customers.find((customer) => customer.id === customerId);
      setList(selectedCustomer || null);
    } else {
      setList(null);
    }
  }, [customerId, customers]);

  const closeModal = useCallback(() => dispatch(closeCustomerModal()), [dispatch]);

  const customerForm = useMemo(
    () => !isLoading && <FormCustomerAdd customer={list} closeModal={closeModal} />,
    [list, isLoading, closeModal]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {isLoading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                customerForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default AddCustomer;
