import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ClassIcon from '@mui/icons-material/Class';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Factory } from '@mui/icons-material';
import Paper from '@material-ui/core/Paper';
import Grid from '@mui/material/Grid2';
import { List, Box, Typography } from '@material-ui/core';
import { useWzdGd } from '../../useContext';
import { PiFactory } from "react-icons/pi";
import { Alert } from '@mui/material/';
import EachItem from "../../components/EachItem";
import CustomList from '../../components/list'
import { MdOutlineClass } from "react-icons/md";
import { PiUserCircleFill } from "react-icons/pi";
import DocumentLetterTable from '../../components/table'
import { Button } from '@material-ui/core';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    margin: 'auto',
    padding: 20,
    minHeight:'280px'
  },
  root: {
    flexGrow: 1,
    border: '1px solid #ccc5c5'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: 'rgb(1, 77, 117)',
    color: '#fff',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    padding: '8px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgb(0, 98, 152)',

    },
    indicator: {
      backgroundColor: 'red',
    },
  },
}));

export default function FormReview() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { supplier, setActiveForm } = useWzdGd();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () =>{
    setActiveForm('isEdit')
  }

  return (
    <>
      <div >
        <Box className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon label tabs example"
            slotProps={{ indicator: {
              style: {
                backgroundColor: 'rgb(28,115,163)'
              }
            }}}
          >
            <Tab icon={<GroupAddIcon />} label="CNPJ" />
            <Tab icon={<Factory />} label="Fabricante" />
            <Tab icon={<ClassIcon />} label="Classe" />
            <Tab icon={<AttachFileIcon />} label="Carta Exclusividade" />
          </Tabs>
        </Box>
        <Box className={classes.form}>
        <TabPanel value={value} index={0}>
          <Grid container >
            <Grid item size={12} sx={{ textAlign: 'left' }} container>
              <Alert severity="info">
                CNPJs comerciais:
              </Alert>
            </Grid>
          </Grid>

          <Grid item size={12} >
            <CustomList
              aValues={supplier.cnpj}
              haveIconAction={false}
              activeItems={true}
              toDoDeleteHandler=""
              icon={<PiUserCircleFill style={{ fontSize: 23 }}
                propKey="id" />}
            />

          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container >
            <Grid item size={12} sx={{ textAlign: 'left' }} container>
              <Alert severity="info">
                Para os CNPJs comerciais, foram encontrados os seguintes fabricantes:
              </Alert>
            </Grid>
          </Grid>

          <Grid item size={12} >
            <CustomList
              aValues={supplier.manufacturer}
              haveIconAction={false}
              activeItems={true}
              toDoDeleteHandler=""
              icon={<PiFactory style={{ fontSize: 23 }}
                propKey="text" />}
            />

          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container >
            <Grid item size={12} sx={{ textAlign: 'left' }} container>
              <Alert severity="info">
                Para os Fabricantes comercializados, foram encontradas as seguintes classes:
              </Alert>
            </Grid>
          </Grid>

          <Grid item size={12} >
            <CustomList
              aValues={supplier._class}
              haveIconAction={false}
              activeItems={true}
              toDoDeleteHandler=""
              icon={<MdOutlineClass style={{ fontSize: 23 }} />}
              propKey="id"
            />
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <DocumentLetterTable aValues={supplier.exclusivityLetter} justView={true}
            setExpiredDate="" setExclusivityLetter="" />
        </TabPanel>
        </Box>
      </div>
      <Box>
      <div className={classes.buttons}>

        <Button disabled={supplier.validatedPetro !== 'concluido'}  
          onClick={handleEdit}  className={classes.button} >
          Editar
        </Button>
      </div>
      </Box>
    </>
  );
}
