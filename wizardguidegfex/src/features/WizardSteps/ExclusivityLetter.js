import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';
import { Button, TableCell, tableCellClasses, Alert } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { readFile, getDateNowFrontFormated } from '../../util';
import { useWzdGd } from '../../useContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useStyles, VisuallyHiddenInput } from './wizardStepCss';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

export default function ExclusivityLetterForm() {
  const classes = useStyles();
  const { supplier, setExclusivityLetter, setActiveNext, setExpiredDate } = useWzdGd();

  const addFile = async (files) => {
    const oFile = files[0];
    const sFileBase64 = await readFile(oFile);
    const oEntry = {
      id: uuidv4(),
      fileName: oFile.name.split('.')[0],
      extension: oFile.name.split('.')[1],
      mediaType: oFile.type,
      uploadState: "Complete",
      revision: "00",
      fileSize: oFile.size,
      updatedAt: getDateNowFrontFormated(new Date(), 'dataAtMinutes'),
      documentType: "Invoice",
      newDocument: true,
      expiredDate: "",
      expiredDateTime: "",
      localFile: sFileBase64.replace('data:application/pdf;base64,', ''),
      url: "",
      status: true,
      lastModifiedBy: ""
    }
    setExclusivityLetter([...supplier.exclusivityLetter, { ...oEntry }])
  }
  const removefile = (data) => {
    const aExclusivityLetter = supplier.exclusivityLetter
      .map((element) => {
        if (element.id === data.id) {
          return {
            ...element,
            status: false,
          }
        }
        return element
      })
    setExclusivityLetter([...aExclusivityLetter])
  }
  const handleDateChange = (event, data) => {
    const invalidDate = isNaN(event.$d);
    setExpiredDate({ ...data, expiredDateTime: event.$d.getTime() }, invalidDate)

  }
  const activeLetters = (item) => (item.status);
  useEffect(() => {
    if (!supplier.exclusivityLetter.length)
      setActiveNext(true);
  }, [])
  const base64ToBlob = (base64String, contentType = '') => {
    var base64Data = base64String.replace(/^data:([^;]+);base64,/, '');
    var binaryData = atob(base64Data);
    var arrayBuffer = new ArrayBuffer(binaryData.length);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    var blob = new Blob([arrayBuffer], { type: contentType });
    return URL.createObjectURL(blob);
  }
  const expiredDateTemplate = (data) => {
    if (data.expiredDate === '') {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker format="DD-MM-YYYY" sx={{ width: '280px' }}
              label="Adicione a data de vencimento" onChange={(event) => handleDateChange(event, data)} />
          </DemoContainer>
        </LocalizationProvider>
      )
    }
    return getDateNowFrontFormated(parseInt(data.expiredDate.slice(6, -2), 10), 'dateAtDay')
  }
  const filenameTemplate = (data) => {
    const blob = base64ToBlob(data.localFile)
    return (
      <a href={blob} style={{ color: '#4b5563', fontStyle: 'italic' }}
        target="_blank" rel="noopener noreferrer">{data.fileName}</a>
    )
  }

  const deleteTemplate = (data) => {
    return <IconButton
      onClick={() => removefile(data)}
      edge="end"
      aria-label="delete"
    >
      <DeleteIcon color="error" />
    </IconButton>
  }
  return (
    <React.Fragment>
      <Grid container >
        <Grid item size={6} sx={{ textAlign: 'left' }} container>
          <Alert severity="info">
            Anexe a Carta de Exclusividade (apenas PDF)
          </Alert>
        </Grid>
        <Grid item size={6} sx={{ textAlign: 'right', }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              accept=".pdf"
              type="file"
              onChange={(event) => addFile(event.target.files)}
              multiple
            />
          </Button>
        </Grid>
      </Grid>
      <PrimeReactProvider>
        <div className="card">
          <DataTable size='small' emptyMessage="Adicionar Carta de Exclusividade" value={supplier.exclusivityLetter.filter(activeLetters)}
            tableStyle={{ minWidth: '50rem' }} >
            <Column field="fileName" header="Arquivo" body={filenameTemplate}></Column>            
            <Column field="expiredDate" header="Data Vencimento" body={expiredDateTemplate}></Column>
            <Column body={deleteTemplate}></Column>
          </DataTable>
        </div>
      </PrimeReactProvider>
    </React.Fragment>
  );
}