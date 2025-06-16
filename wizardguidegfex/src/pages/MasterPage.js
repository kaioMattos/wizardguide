import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import FormWizardSteps from '../features/WizardSteps/Form';
import FormReview from '../features/Review/Form'
import { getUserLogged, getSupplier } from "../api";
import { useWzdGd } from '../useContext'


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
  },
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export default function MasterPage() {
  const classes = useStyles();
  const { supplier, setSupplierContext } = useWzdGd();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const user = await getUserLogged();
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
    loadData();
  }, []);

  return (
    <Box sx={{ margin: 'auto' }}>
      <Box className={classes.paper}>
        {loading ? (
            <CircularProgress disableShrink={loading} />
          ) : (<> {supplier.validatedPetro === '' || supplier.validatedPetro === 'isEdit' ? (<FormWizardSteps />) : (<FormReview />)}</>)}
        {/* <FormWizardSteps /> */}
      </Box>
    </Box>
  );
}