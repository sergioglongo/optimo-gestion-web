import { useState } from 'react';

// project import
import NavUser from './NavUser';
import Navigation from './Navigation';
import NavGroup from './Navigation/NavGroup';
import SimpleBar from 'components/third-party/SimpleBar';

// menu-items
import { parameters } from 'menu-items';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const [selectedItems, setSelectedItems] = useState<string | undefined>('expensas-collapse');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  return (
    <>
      <SimpleBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Navigation selectedItems={selectedItems} setSelectedItems={setSelectedItems} setSelectedLevel={setSelectedLevel} />
      </SimpleBar>
      <NavGroup
        key={parameters.id}
        item={parameters}
        setSelectedItems={setSelectedItems}
        setSelectedLevel={setSelectedLevel}
        selectedLevel={selectedLevel}
        selectedItems={selectedItems}
        lastItem={0}
        remItems={[]}
        lastItemId=""
      />
      <NavUser />
    </>
  );
};

export default DrawerContent;
