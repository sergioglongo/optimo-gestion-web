import { Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { CheckOutlined } from '@ant-design/icons';
import StandardLogo from 'assets/images/price/Standard';
import StandardPlusLogo from 'assets/images/price/StandardPlus';
import Logo from 'components/logo';

// plan list
const plans = [
  {
    active: false,
    icon: <StandardLogo />,
    title: 'Basic',
    description: 'Price per Tax professional $2,500 Up to 1000 files $50/file',
    price: 69,
    permission: [0, 1],
    planList: {
      'Core Tax Preparation': [
        'Federal and provincial/territorial tax return preparation for individuals and businesses.',
        'Form auto-fill and calculation.',
        'Error checking and validation.',
        'E-filing capabilities.'
      ],
      'Client Management': [
        'Basic client portal for secure document sharing.',
        'Client data storage and organization.',
        'Basic reporting and tracking.'
      ],
      Support: ['Standard email support (with reasonable response times).', 'Access to knowledge base and FAQ resources.']
    }
  },
  {
    active: true,
    icon: <StandardPlusLogo />,
    title: 'Pro',
    description: 'Price per Tax professional $2,500 Up to 1500 files $40/file',
    price: 129,
    permission: [0, 1, 2, 3],
    planList: {
      'Everything in the Basic plus': {
        'Advanced Tax Tools': [
          'Tax planning and optimization features.',
          'Support for more complex tax scenarios (e.g., investments, foreign income).',
          'Integration with CRA databases for automatic data updates.'
        ],
        'Enhanced Client Management': [
          'Advanced client portal with e-signature capabilities.',
          'Customizable client communication templates.',
          'Client activity tracking and reminders.'
        ],
        'Reporting and Analytics': [
          'Customizable reports for firm performance and client insights.',
          'Basic data visualization and dashboards.'
        ],
        Support: ['Priority email support (faster response times).', 'Limited phone support (e.g., during business hours).']
      }
    }
  },
  {
    active: false,
    icon: <Logo isIcon sx={{ width: 36, height: 36 }} />,
    title: 'Enterprise',
    description: 'Price per Tax professional $2,500 more than 1500 files $30/file',
    price: 599,
    permission: [0, 1, 2, 3, 5],
    planList: {
      'Everything in the Pro plus': {
        'Premium Support': ['Dedicated account manager', 'Priority phone/email support'],
        'Advanced Analytics': ['Deeper insights into client data, trends, and performance'],
        'Integration Options': ['Seamless connection with other accounting or practice management software'],
        'Training and Onboarding': ['Personalized training sessions', 'Webinars', 'Knowledge base access'],
        'White-Labeling': ["Option to brand the software with the firm's logo and colors"]
      }
    }
  }
];

const Pricing = () => {
  const theme = useTheme();

  const renderItems = (items: any) => {
    return Array.isArray(items)
      ? items.map((item, itemIndex) => (
          <ListItem key={itemIndex} divider>
            <ListItemIcon>
              <CheckOutlined />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))
      : Object.entries(items).map(([subCategory, subItems]) => (
          <Fragment key={subCategory}>
            <ListSubheader>{subCategory}</ListSubheader>
            {renderItems(subItems)}
          </Fragment>
        ));
  };

  return (
    <Grid container spacing={3}>
      <Grid item container spacing={3} xs={12}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MainCard sx={{ pt: 1.75 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} textAlign="center">
                    {plan.icon}
                    <Typography variant="h4">{plan.title}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{plan.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant={plan.active ? 'contained' : 'outlined'} fullWidth>
                    Order Now
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <List
                    sx={{
                      m: 0,
                      p: 0,
                      '&> li': {
                        px: 0,
                        py: 0.625,
                        '& svg': {
                          fill: theme.palette.success.dark
                        }
                      }
                    }}
                    component="ul"
                  >
                    {Object.entries(plan.planList).map(([category, items]) => (
                      <Fragment key={category}>
                        <ListSubheader>{category}</ListSubheader>
                        {renderItems(items)}
                      </Fragment>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Pricing;
