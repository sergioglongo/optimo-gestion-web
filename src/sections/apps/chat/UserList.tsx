import { Fragment, useEffect, useState } from 'react';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material';

// project imports
import UserAvatar from './UserAvatar';
import Dot from 'components/@extended/Dot';
import { useGetUsers } from 'api/chat';

// types
import { KeyedObject } from 'types/root';
import { UserProfile } from 'types/auth';

interface UserListProps {
  setUser: (u: UserProfile) => void;
  search?: string;
  selectedUser: string | null;
}

function UserList({ setUser, search, selectedUser }: UserListProps) {
  // const theme = useTheme();
  const [data, setData] = useState<UserProfile[]>([]);
  const { usersLoading, users } = useGetUsers();

  useEffect(() => {
    if (!usersLoading) {
      let result = users;
      if (search) {
        result = users.filter((row: KeyedObject) => {
          let matches = true;

          const properties: string[] = ['name'];
          let containsQuery = false;

          properties.forEach((property) => {
            if (row[property].toString().toLowerCase().includes(search.toString().toLowerCase())) {
              containsQuery = true;
            }
          });

          if (!containsQuery) {
            matches = false;
          }
          return matches;
        });
      }
      setData(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersLoading, search]);

  if (usersLoading)
    return (
      <List>
        {[1, 2, 3, 4, 5].map((index: number) => (
          <ListItem key={index} divider>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton animation="wave" height={24} />}
              secondary={<Skeleton animation="wave" height={16} width="60%" />}
            />
          </ListItem>
        ))}
      </List>
    );

  return (
    <List component="nav">
      {data.map((user) => (
        <Fragment key={user.id}>
          <ListItemButton
            sx={{ pl: 1 }}
            onClick={() => {
              setUser(user);
            }}
            divider
            selected={user.id === selectedUser}
          >
            <ListItemAvatar>
              <UserAvatar user={user} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.usuario}
                  </Typography>
                  <Typography component="span" color="textSecondary" variant="caption">
                    {user.usuario}
                  </Typography>
                </Stack>
              }
              secondary={
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <>Online</>
                  <>
                    <Dot color="primary" />
                  </>
                </Typography>
              }
            />
          </ListItemButton>
        </Fragment>
      ))}
    </List>
  );
}

export default UserList;
