import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Stepper, styled, Step, StepLabel, Box } from '@mui/material';
import { Button } from '@material-ui/core';
import { Check, Factory } from '@mui/icons-material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ClassIcon from '@mui/icons-material/Class';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import { Factory } from '@mui/icons-material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { makeStyles } from '@material-ui/core/styles';

import { postSupplier, postExclusivityLetter, putSupplier, deleteExclusivityLetter } from "../../api";
import { useWzdGd } from '../../useContext'
import CnpjForm from './Cnpj';
import ManufacturerForm from './Manufacturer';
import ClassForm from './Class';
import ExclusivityLetterForm from './ExclusivityLetter';
import CustomDialog from '../../components/modal'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25,
    left: 'calc(-250% + 16px)',
    right: 'calc(25% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#557C93',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#557C93',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled('div')(({ theme }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: '#784af4',
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};


const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 55,
  height: 55,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient(270deg, rgb(0, 98, 152) 0%, rgb(84, 123, 146) 100%);',
        boxShadow: '0 4px 10px 0 rgba(5, 19, 36, 0.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient(270deg, rgb(0, 98, 152) 0%, hsla(202, 27%, 45%, 1) 100%);',
      },
    },
  ],
}));

function getStepContent(step) {
  switch (step) {
    case 0:
      return <CnpjForm />;
    case 1:
      return <ManufacturerForm />;
    case 2:
      return <ClassForm />;
    case 3:
      return <ExclusivityLetterForm />;
    default:
      throw new Error('Unknown step');
  }
}

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <GroupAddIcon style={{ fontSize: 30 }} />,
    2: <Factory style={{ fontSize: 30 }} />,
    3: <ClassIcon style={{ fontSize: 30 }} />,
    4: <AttachFileIcon style={{ fontSize: 30 }} />
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};


const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    margin: 'auto',
    padding: 20,
    minHeight:'350px'
  },
  step: {
    '&:hover': {
      cursor: 'pointer',

    }, width: '10%', flex: 'initial'
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
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




const steps = ['CNPJ', 'Fabricante', 'Classe', 'Carta de Exclusividade'];

const returnOentryLetter = (item)=>({
  id:item.id,
          localFile: item.localFile,
          fileName: item.fileName,
          extension: item.extension,
          mediaType: item.mediaType,
          expiredDate: new Date(item.expiredDateTime),
          createdAt: new Date(),
          updatedAt: new Date(),
          documentId: `${process.env.REACT_APP_SUPPLIER_TEST}`
})

export default function FormWizardSteps() {

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { supplier, setActiveForm } = useWzdGd();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload()
  };

  const handleEdit = () =>{
    setActiveForm('concluido')
  }
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = async () => {
    if ((activeStep + 1) < 4)
      return setActiveStep(activeStep + 1);
    try {
      // setLoading(true);
      const oEntrySupplier = {
        documentId: `${process.env.REACT_APP_SUPPLIER_TEST}`,
        cnpj: JSON.stringify(supplier.cnpj),
        manufacturer: JSON.stringify(supplier.manufacturer),
        class: JSON.stringify(supplier._class),
        validatedPetro: 'concluido',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const oEntryDocuments = supplier.exclusivityLetter
      .filter((item)=>(item.status && item.newDocument))
      .map(returnOentryLetter)
      const oEntryDocumentsDelete = supplier.exclusivityLetter
      .filter((item)=>(!item.status && !item.newDocument))
      .map(returnOentryLetter)
      // const oEntryDocuments = supplier.exclusivityLetter.map((item) => (
      //   {
      //     id:item.id,
      //     localFile: item.file,
      //     fileName: item.fileName,
      //     extension: item.extension,
      //     mediaType: item.mediaType,
      //     expiredDate: new Date(item.expiredDateTime),
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //     documentId: `${process.env.REACT_APP_SUPPLIER_TEST}`
      //   }
      // ))
      console.log(oEntrySupplier)
      let aPromiseSupplier = []
      if(supplier.validatedPetro === 'isEdit'){
        aPromiseSupplier = putSupplier(oEntrySupplier);

        oEntryDocumentsDelete.map((oEntry) => (deleteExclusivityLetter(oEntry)))
        
      }else{
        aPromiseSupplier = postSupplier(oEntrySupplier);
      }
      
      const aPromiseExclusivityLetter = oEntryDocuments.map((oEntry) => (postExclusivityLetter(oEntry)))
      await Promise.all([aPromiseSupplier, ...aPromiseExclusivityLetter]);
      handleClickOpen();
      // handleEdit();
    } finally {
      // setLoading(false);
      
    }
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  return (
    <Box >
      <Stack sx={{

        width: '100%', border: '1px solid rgb(29,115,163)',
        paddingTop: '22px', paddingBottom: '7px', borderRadius: '10px'
      }} spacing={4}>
        <Stepper sx={{ justifyContent: 'space-between' }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label, index) => (
            <Step onClick={handleStep(index)} key={label} className={classes.step}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <React.Fragment>
      <CustomDialog handleClose={()=>handleClose()} open={open}/>
        <React.Fragment>
          <Box className={classes.form}>
            {getStepContent(activeStep)}
          </Box>
          <Box>
          <div className={classes.buttons}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} className={classes.button}>
                Anterior
              </Button>
            )}
            <Button
              disabled={supplier.activeNextDisabled}

              variant="contained"
              onClick={handleNext}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
          </Box>
        </React.Fragment>
      </React.Fragment>
    </Box>
  );
}