import React, { useEffect, useState } from 'react';
import { Grid, TextField, List, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EachItem from "../../components/EachItem";
import { PiUserCircleFill } from "react-icons/pi";
import { useWzdGd } from '../../useContext';
import { getSupplier, getManufacturer, getClass } from '../../api'
import { CircularProgress, Collapse, Alert } from '@mui/material';
import DeleteIcon from "@material-ui/icons/Delete";
import { assembleOrFilterGeneric, removeDuplicatesFromArray } from '../../util';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

const useStyles = makeStyles((theme) => ({

  form: {
    marginTop: theme.spacing(1),
    margin: 'auto',
    padding: 20,
  },
  buttonAdd: {
    backgroundColor: 'rgb(138,35,135)',
    background: 'rgb(135, 88, 255)',
    color: 'rgb(255, 255, 255)',
    border: 'none',
    cursor: 'pointer',
  },
  list: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  }
}))

export default function CnpjForm() {
  const classes = useStyles();
  const { supplier, setCnpj, setActiveNext, setManufacturer, setAssembleInitDataPerCnpj } = useWzdGd();
  const [notFounded, setNotFounded] = useState(false);
  const [state, setState] = useState({ error: false, inputCnpj: "" });
  const [loading, setLoading] = useState(false);

  const assembleManufacturer = async (sCnpj) => {
    const oData = await getManufacturer({
      $filter: `DocumentId eq '${sCnpj}'`,
      $expand: "toManu"
    });
    const manufacturer = oData.flatMap((item) => {
      return item.toManu.results.map((manu) => ({
        status: true,
        text: manu.mfrnr,
        ManufacturerNumber: manu.mfrnr,
        DocumentId: sCnpj
      }))
    })
    return [...supplier.manufacturer, ...manufacturer];
  }

  const assembleClass = async () => {
    const sFiltersCnpj = assembleOrFilterGeneric(supplier, 'ManufacturerNumber', 'manufacturer');
    const oData = await getClass({
      $filter: `${sFiltersCnpj}`,
      $top: 1000
    });
    const classCollection = oData.map((item) => ({
      numberClass: item.Class,
      class: item.ClassDescription,
      text: `${item.Class} - ${item.ClassDescription}`,
      ManufacturerNumber: item.ManufacturerNumber,
      status: true
    }))
    // console.log(classCollection)
    const _class = removeDuplicatesFromArray(classCollection);
    return [...supplier._class, ..._class]
  }

  const addToDoHandler = async (e) => {
    e.preventDefault();
    const sCnpj = state.inputCnpj;
    const cnpjExistInList = !supplier.cnpj.find((item) => item.DocumentId === sCnpj);
    if (sCnpj !== "" && cnpjExistInList) {
      try {
        setLoading(true)
        const fornecedor = await getSupplier({
          $filter: `DocumentId eq '${sCnpj}'`
        });
        if (!!Object.values(fornecedor).length) {

          const aCollectionCnpj = [...supplier.cnpj, {
            text: `${fornecedor.SupplierId} - ${fornecedor.SupplierName}`,
            DocumentId: fornecedor.DocumentId,
            status: true
          }];
          const aCollectionManufacturer = await assembleManufacturer(sCnpj);
          const aCollectionClass = await assembleClass(sCnpj);

          setAssembleInitDataPerCnpj(aCollectionCnpj, aCollectionManufacturer, aCollectionClass)
          // setActiveNext(true);
          setNotFounded(false);
        } else {
          setNotFounded(true);
        }
        setState({ inputCnpj: "" })
      } finally {
        setLoading(false);
      }

    } else {
      setState({ error: true });
    }
  };


  const inputHandler = (e) => {
    setState({
      [e.currentTarget.name]: e.currentTarget.value,
      error: e.currentTarget.value === "" ? true : false
    });
  };

  const toDoDeleteHandler = (oCnpj) => {
    const aCltCnpj = supplier.cnpj.filter((element) => element.DocumentId !== oCnpj.DocumentId);
    const aCltManuf = supplier.manufacturer.filter((item) => (item.DocumentId !== oCnpj.DocumentId));
    const retiredManufacturer = supplier.manufacturer.filter((item) => (item.DocumentId === oCnpj.DocumentId));
    const aCltClass = supplier._class.filter((item) => {
      const finded = !retiredManufacturer.find((manufacturer) => (manufacturer.ManufacturerNumber === item.ManufacturerNumber));
      return finded
    });
    // console.log(aCltClass)
    setAssembleInitDataPerCnpj(aCltCnpj, aCltManuf, aCltClass);
  };

  useEffect(() => {
    if (!!supplier.cnpj.length)
      setActiveNext(false);
  }, [])

  return (
    <React.Fragment>
      <form onSubmit={addToDoHandler}>
        
          <Grid container spacing={3}  >
            <Grid item xs={12} sm={12}>
              <div className="flex flex-column gap-2" style={{ textAlign: 'left', color: 'rgb(77, 77, 77)' }}>
                <label htmlFor="cnpjInput">Chave do Fornecedor</label>
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText
                    id="cnpj"
                    name="inputCnpj"
                    invalid={state.error}
                    value={state.inputCnpj}
                    onChange={inputHandler}
                    placeholder="Pesquisar" style={{ width: '100%' }} />
                </IconField>
                <small id="cnpjInput-help">
                  Tecle enter para Adicionar
                </small>
              </div>
              {/* <TextField
                required
                id="cnpj"
                name="inputCnpj"
                label="Insira aqui a chave do Fornecedor"
                fullWidth
                autoComplete="shipping address-line1"
                error={state.error}
                value={state.inputCnpj}
                onChange={inputHandler}
              /> */}
              <Collapse in={notFounded}>
                <Alert sx={{ borderRadius: '6px', padding: '4px 10px' }} severity="error">Fornecedor não encontrado</Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12} className={classes.list}>
              {loading ? (
                <CircularProgress disableShrink={loading} />
              ) : (
                <List
                style={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 250,
                }}>
                  {supplier.cnpj.map((cnpj) => {
                    return (
                      <EachItem
                        iconButtonHandler={<DeleteIcon style={{color:'gray'}} />}
                        toDoDeleteHandler={toDoDeleteHandler}
                        key={cnpj.id}
                        oItem={cnpj}
                        icon={<PiUserCircleFill style={{ fontSize: 23 }} />}
                      />
                    );
                  })}
                </List>
              )
              }
            </Grid>
          </Grid>
        
      </form>
    </React.Fragment>
  );
}