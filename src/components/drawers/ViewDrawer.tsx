import { Drawer, Box, Typography, IconButton, Stack, Divider, Chip, List, ListItem, ListItemText, Grid } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { ReactNode } from 'react';

export interface DrawerItem {
  label: string;
  value: string | string[] | ReactNode;
}

interface ViewDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: readonly (DrawerItem | readonly [DrawerItem, DrawerItem?])[];
  children?: ReactNode;
}

const ViewDrawer = ({ open, onClose, title, items, children }: ViewDrawerProps) => {
  const renderValue = (item: DrawerItem) => {
    if (Array.isArray(item.value)) {
      if (item.value.length === 0) return 'Ninguno';
      return (
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 1 }}>
          {item.value.map((val, index) => (
            <Chip key={index} label={val} size="small" />
          ))}
        </Stack>
      );
    }
    if (typeof item.value === 'string') {
      return item.value || '-';
    }
    // If it's a ReactNode or something else
    return item.value;
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <IconButton color="error" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        <MainCard content={false} sx={{ mt: 2, boxShadow: 'none', border: 'none' }}>
          <List sx={{ py: 0 }}>
            {items.map((rowItem, index) => {
              if (Array.isArray(rowItem)) {
                // Two-column layout
                return (
                  <ListItem key={index} divider={index < items.length - 1}>
                    <Grid container spacing={2}>
                      {rowItem.map(
                        (colItem, colIndex) =>
                          colItem && (
                            <Grid item xs={6} key={colIndex}>
                              <ListItemText
                                primary={colItem.label}
                                secondary={renderValue(colItem)}
                                secondaryTypographyProps={{ component: 'div', variant: 'subtitle1', color: 'text.primary' }}
                              />
                            </Grid>
                          )
                      )}
                    </Grid>
                  </ListItem>
                );
              }
              // Single-column layout
              const singleItem = rowItem as DrawerItem;
              return (
                <ListItem key={index} divider={index < items.length - 1}>
                  <ListItemText
                    primary={singleItem.label}
                    secondary={renderValue(singleItem)}
                    secondaryTypographyProps={{ component: 'div', variant: 'subtitle1', color: 'text.primary' }}
                  />
                </ListItem>
              );
            })}
          </List>
        </MainCard>
        {children}
      </Box>
    </Drawer>
  );
};

export default ViewDrawer;
