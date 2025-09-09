// material-ui
import { Grid, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| PAGE VIEWS BY PAGE TITLE ||============================== //

function PageViews() {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Clients with outstanding documents</Typography>
        </Grid>
        <Grid item />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
          <ListItemButton divider>
            <ListItemText primary={<Typography variant="subtitle1">Client A</Typography>} />
            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary">
                5 out of 10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                50%
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText primary={<Typography variant="subtitle1">Client B</Typography>} />
            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary">
                3 out of 10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                30%
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText primary={<Typography variant="subtitle1">Client C</Typography>} />
            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary">
                1 out of 10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                10%
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText primary={<Typography variant="subtitle1">Client D</Typography>} />
            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary">
                2 out of 10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                20%
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText primary={<Typography variant="subtitle1">Client E</Typography>} />
            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary">
                8 out of 10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                80%
              </Typography>
            </Stack>
          </ListItemButton>
        </List>
      </MainCard>
    </>
  );
}
export default PageViews;
