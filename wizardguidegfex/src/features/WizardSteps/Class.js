import React, { useEffect, useState } from 'react';
import { List } from '@material-ui/core';
import Grid from '@mui/material/Grid2';
import { ToggleButton, ToggleButtonGroup, Alert } from '@mui/material/';
import EachItem from "../../components/EachItem";
import { MdOutlineClass } from "react-icons/md";
import { useWzdGd } from '../../useContext';
import DeleteIcon from "@material-ui/icons/Delete";
import UndoIcon from '@mui/icons-material/Undo';
import { useStyles } from './wizardStepCss';

export default function ClassForm() {
  const classes = useStyles();
  const [toggleButton, setToggleButton] = useState(true);
  const { supplier, setClass, setActiveNext } = useWzdGd();

  const loadData = async () => {
    const disabledButtonNext = !supplier._class.filter((item) => item.status).length
    setActiveNext(disabledButtonNext)
  }

  const toDoDeleteHandler = (oClass) => {
    const updatedClass = supplier._class.map((_class) => {
      if (oClass.numberClass === _class.numberClass) {
        _class.status = !toggleButton
      }
      return _class
    })
    setClass(updatedClass);
  };

  useEffect(() => {
    loadData()
  }, [])
  const handleChange = (event, newAlignment) => {
    setToggleButton(newAlignment === 'comercializo' ? true : false);
  };
  return (
    <React.Fragment>
      <Grid container >
        <Grid item size={8} sx={{ textAlign: 'left' }} container>
          <Alert severity="info">
            Para os Fabricantes comercializados, foram encontradas as seguintes classes:
          </Alert>
        </Grid>
        <Grid item size={4} sx={{ textAlign: 'right' }}>
          <ToggleButtonGroup
            color="primary"
            value={toggleButton ? 'comercializo' : 'nComercializo'}
            exclusive
            onChange={handleChange}
            size="small"
          >
            <ToggleButton value="comercializo" style={{ padding: '10px' }}>comercializo</ToggleButton>
            <ToggleButton value="nComercializo" style={{ padding: '10px' }}>Não comercializo</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid item size={12} className={classes.list}>
        <List
          style={{
            width: '100%',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 250,
          }}
        >
          {supplier._class
            .filter((_class) => (_class.status === toggleButton))
            .map((_class) => {
              return (
                <EachItem
                  iconButtonHandler={toggleButton ? <DeleteIcon style={{ color: 'gray' }} /> : <UndoIcon color="primary" />}
                  toDoDeleteHandler={toDoDeleteHandler}
                  key={_class.id}
                  oItem={_class}
                  icon={<MdOutlineClass style={{ fontSize: 23 }} />}
                />
              );
            })}
        </List>
      </Grid>
    </React.Fragment>
  );
}