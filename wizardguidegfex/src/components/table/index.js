
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getDateNowFrontFormated } from '../../util';

export default function DocumentLetterTable({aValues, justView, setExclusivityLetter, setExpiredDate}) {
  const activeLetters = (item)=>(item.status);

  const filenameTemplate = (data) => {
    const blob = base64ToBlob(data.localFile)
    return (
      <a href={blob} style={{ color: '#4b5563', fontStyle: 'italic' }}
        target="_blank" rel="noopener noreferrer">{data.fileName}</a>
    )
  }
  const handleDateChange = (event, data) => {
    const invalidDate = isNaN(event.$d);
    // setActiveNext(invalidDate);
    setExpiredDate({ ...data, expiredDateTime: event.$d.getTime() }, invalidDate)

  }
  const base64ToBlob = (base64String, contentType = '') => {
    // Remove data URL prefix if it exists
    var base64Data = base64String.replace(/^data:([^;]+);base64,/, '');

    // Convert base64 to raw binary data
    var binaryData = atob(base64Data);

    // Create array buffer from binary data
    var arrayBuffer = new ArrayBuffer(binaryData.length);
    var uint8Array = new Uint8Array(arrayBuffer);

    // Fill array buffer with binary data
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create blob from array buffer
    var blob = new Blob([arrayBuffer], { type: contentType });

    // Create and return blob URL
    return URL.createObjectURL(blob);
  }
  const deleteTemplate = (data) => {
    if(justView){
      return ''
    }
    return <IconButton
      onClick={()=>removefile(data)}
      edge="end"
      aria-label="delete"
    >
      <DeleteIcon color="error" />
    </IconButton>
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
  const removefile = (data)=>{
    const aExclusivityLetter = aValues
    .map((element) => {
      if(element.id === data.id){
        return {
          ...element,
          status:false,
        }
      }
      return element
    })
    setExclusivityLetter([...aExclusivityLetter])
    // console.log(data)
  }
  return (
    <PrimeReactProvider>
    <div className="card">
      <DataTable size='small' emptyMessage="Adicionar Carta de Exclusividade" value={aValues.filter(activeLetters)}
        tableStyle={{ minWidth: '50rem' }} >
       
        <Column field="fileName" header="Arquivo" body={filenameTemplate}></Column>
        {/* <Column field="updatedAt" header="Última Modificação"></Column> */}
        <Column field="expiredDate" header="Data Vencimento" body={expiredDateTemplate}></Column>
        {}
        <Column body={deleteTemplate}></Column>
      </DataTable>
    </div>
  </PrimeReactProvider>
  );
}
