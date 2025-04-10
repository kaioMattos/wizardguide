import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Stepper, styled, Step, StepLabel, Box } from '@mui/material';
import { Typography, Button, Paper } from '@material-ui/core';
// import { Button } from 'primereact/button';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';

import { Check } from '@mui/icons-material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { Factory } from '@mui/icons-material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ClassIcon from '@mui/icons-material/Class';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CnpjForm from './CnpjStep';
import ManufacturerForm from './ManufacturerStep';
import ClassForm from './ClassStep';
import ExclusivityLetterForm from './ExclusivityLetterStep';

import { getUserLogged, getSupplier, postSupplier, postExclusivityLetter } from "../api";
import { useWzdGd } from '../useContext'


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

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

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
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),

  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
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

export default function MasterPage() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { supplier } = useWzdGd();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);
      setLoading(true);

      // const user = await getUserLogged();
      // const tableMaterials = await getSupplier();
      // console.log(supplier);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // when component mounted
    loadData(true);
  }, []);

  const handleNext = async () => {    
    if ((activeStep + 1) < 4)
      return setActiveStep(activeStep + 1);
    try {
      setLoading(true);
      const oEntrySupplier = {
        documentId: '03680252000106',
        cnpj: JSON.stringify(supplier.cnpj),
        manufacturer: JSON.stringify(supplier.manufacturer),
        class: JSON.stringify(supplier._class),
        validatedPetro: 'concluido',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const oEntryDocuments = supplier.exclusivityLetter.map((item) => (
        {
          localFile: item.file,
          fileName: item.fileName,
          extension: item.extension,
          mediaType: item.mediaType,
          expiredDate: new Date(item.expiredDateTime),
          createdAt: new Date(),
          updatedAt: new Date(),
          documentId: '03680252000106'
        }
      ))
      console.log(oEntrySupplier)
      const aPromiseSupplier = postSupplier(oEntrySupplier);
      const aPromiseExclusivityLetter = oEntryDocuments.map((oEntry)=>(postExclusivityLetter(oEntry))) 
      await Promise.all([aPromiseSupplier, ...aPromiseExclusivityLetter]);
    } finally {
      setLoading(false);
    }
    

  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box sx={{ margin: 'auto' }}>
      <main className={classes.layout}>
        <Paper className={classes.paper}>

          <Stack sx={{ width: '100%', }} spacing={4}>
            <Stepper sx={{ justifyContent: 'space-between' }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {steps.map((label) => (
                <Step key={label} sx={{ width: '10%', flex: 'initial' }}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
          <React.Fragment>
            {/* {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                  </Typography>
                </React.Fragment>
              ) : ( */}
            <React.Fragment>
              {getStepContent(activeStep)}
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
            </React.Fragment>
            {/* )} */}
          </React.Fragment>

        </Paper>
      </main>
    </Box>
  );
}