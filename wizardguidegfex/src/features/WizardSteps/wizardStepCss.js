import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';

export const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
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



export const QontoStepIconRoot = styled('div')(({ theme }) => ({
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

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    border: '1px solid #ccc5c5'
  },
  form: {
    // marginTop: theme.spacing(1),
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
    backgroundColor: 'rgb(0,142,145)',
    color: '#fff',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: 'rgb(0, 98, 152)',

    },
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
  },
  table: {
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(2),
  }
}))
