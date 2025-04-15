import React, { useEffect, useState } from 'react';
import { List } from '@material-ui/core';
import Grid from '@mui/material/Grid2';
import { ToggleButton, ToggleButtonGroup, Alert } from '@mui/material';
import EachItem from "../../components/EachItem";
import { PiFactory } from "react-icons/pi";
import { useWzdGd } from '../../useContext';
import DeleteIcon from "@material-ui/icons/Delete";
import UndoIcon from '@mui/icons-material/Undo';
import { useStyles } from './wizardStepCss';

export default function ManufacturerForm() {
  const classes = useStyles();
  const [toggleButton, setToggleButton] = useState(true);
  const { supplier, setManufacturer, setManufClass, setActiveNext } = useWzdGd();

  const toDoDeleteHandler = (oManufacturer) => {
    const updatedManufac = supplier.manufacturer.map((manufacturer) => {
      if (oManufacturer.text === manufacturer.text) {
        manufacturer.status = !toggleButton;
      }
      return manufacturer
    })
    setManufacturer(updatedManufac);
    const aCltClass = supplier._class.map((item) => {
      if (item.ManufacturerNumber === oManufacturer.ManufacturerNumber) {
        const removeClass = !toggleButton ? true : '';
        return { ...item, status: removeClass }
      }
      return item
    });
    setManufClass([...aCltClass]);
  };

  const loadData = async () => {
    const disabledButtonNext = !supplier.manufacturer.filter((item) => item.status).length;
    setActiveNext(disabledButtonNext);
  }
  useEffect(() => {
    loadData();
  }, [])
  const handleChange = (event, newAlignment) => {
    setToggleButton(newAlignment === 'comercializo' ? true : false);
  };
  return (
    <React.Fragment>
      <Grid container >
        <Grid item size={8} sx={{ textAlign: 'left' }} container>
          <Alert severity="info">
            Para os CNPJs comerciais, foram encontrados os seguintes fabricantes:
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
          }}>
          {supplier.manufacturer
            .filter((manufacturer) => (manufacturer.status === toggleButton))
            .map((manufacturer) => {
              return (
                <EachItem
                  iconButtonHandler={toggleButton ? <DeleteIcon style={{ color: 'gray' }} /> : <UndoIcon color="primary" />}
                  toDoDeleteHandler={toDoDeleteHandler}
                  key={manufacturer.text}
                  oItem={manufacturer}
                  icon={<PiFactory style={{ fontSize: 23 }} />}
                />
              );
            })}
        </List>
      </Grid>
    </React.Fragment>
  );
}