import { useMemo } from 'react';

// material-ui
import { Modal } from '@mui/material';

// project-imports
import FormCustomerAdd from './FormCustomerAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// types
import { CustomerList } from 'types/customer';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  customer?: CustomerList | null;
}

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

const CustomerModal = ({ open, modalToggler, customer }: Props) => {
  const closeModal = () => modalToggler(false);

  const customerForm = useMemo(
    () => <FormCustomerAdd customer={customer || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [customer]
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
              {customerForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default CustomerModal;
