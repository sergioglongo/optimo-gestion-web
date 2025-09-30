import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import {
  setConsorcios,
  selectConsorcio,
  clearConsorcios,
  setSelectedConsorcio as setSelectedConsorcioAction
} from 'store/slices/consorcio';
import { Consorcio } from 'types/consorcio';

const useConsorcio = () => {
  const dispatch = useDispatch();
  const { consorciosList, selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  return {
    consorciosList,
    selectedConsorcio,
    setConsorcios: (consorcios: Consorcio[]) => dispatch(setConsorcios(consorcios)),
    selectConsorcio: (consorcioId: string | number) => dispatch(selectConsorcio(consorcioId)),
    clearConsorcios: () => dispatch(clearConsorcios()),
    setSelectedConsorcio: (consorcio: Consorcio) => dispatch(setSelectedConsorcioAction(consorcio))
  };
};

export default useConsorcio;
