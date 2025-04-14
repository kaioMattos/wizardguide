import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FormWizardSteps from '../features/WizardSteps/Form';
import FormReview from '../features/Review/Form'
import { getUserLogged, getSupplier, postSupplier, postExclusivityLetter } from "../api";
import { useWzdGd } from '../useContext'


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),

  },
  paper: {

    marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    // [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
    //   // marginTop: theme.spacing(6),
    //   marginBottom: theme.spacing(6),
    //   padding: theme.spacing(3),
    // },
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
  },
}));

export default function MasterPage() {
  const classes = useStyles();
  const { supplier, setSupplierContext } = useWzdGd();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      // const user = await getUserLogged();
      const supplierS4 = await getSupplier({
        $filter: `DocumentId eq '${process.env.REACT_APP_SUPPLIER_TEST}'`,
        $expand:'toExCard'
      });
      if (!!supplierS4.cnpj.length) {
        const oSupplierContext = {
          documentId: supplierS4.DocumentId,
          cnpj: JSON.parse(supplierS4.cnpj),
          manufacturer: JSON.parse(supplierS4.manufacturer),
          _class: JSON.parse(supplierS4.class),
          exclusivityLetter: supplierS4.toExCard.results.map((item)=>({...item, status:true})),
          activeNextDisabled: false,
          validatedPetro: supplierS4.validatedPetro,

        }

        setSupplierContext(oSupplierContext)
        console.log(oSupplierContext);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // when component mounted
    loadData();
  }, []);

  return (
    <Box sx={{ margin: 'auto' }}>
      {/* <main className={classes.layout}> */}
      <Box className={classes.paper}>
        {loading ? (
            <CircularProgress disableShrink={loading} />
          ) : (<> {supplier.validatedPetro === '' || supplier.validatedPetro === 'isEdit' ? (<FormWizardSteps />) : (<FormReview />)}</>)}
        {/* <FormWizardSteps /> */}
      </Box>
      {/* </main> */}
    </Box>
  );
}