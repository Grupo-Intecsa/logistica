import React, { useState } from 'react';
import { Typography, Box, Divider, Button } from '@mui/material'
import TableFlotillas from '../Components/TableFlotillas'
import NewDocument from '../Components/Modal/NewDocument';
import { useRouter } from 'next/router'
import dayjs from 'dayjs';
import { columnsDocumentosFlotillas as columns } from '../utils/columnsTables.js'
import getPDF from '../utils/getPDF.js'

function Empresa({ empresa, documents, vehicles }){

  const [selectedRow, setSelectedRow] = useState([]);  
  const getRowData = () => {
    const traslados = documents.traslado !== 0 
    ? documents.traslado.map(document => {
      return {
        ...document,
        id: document._id,
        type: 'Traslado',
        request_date: dayjs(document.request_date).format('YYYY-MM-DD'),
        delivery_date: dayjs(document.delivery_date).format('YYYY-MM-DD'),
      }
    })
    : []

    const fletes = documents.fletes.length !== 0
    ? documents.fletes.map(document => {
      return {
        ...document,
        id: document._id,
        type: 'Flete',
        request_date: dayjs(document.request_date).format('YYYY-MM-DD'),
        delivery_date: dayjs(document.delivery_date).format('YYYY-MM-DD'),
      }
    })
    : []

    const rentas = documents.rentas.length !== 0
    ? documents.rentas.map(document => {
      return {
        ...document,
        id: document._id,
        type: 'Renta',
        request_date: dayjs(document.request_date).format('YYYY-MM-DD'),
        delivery_date: dayjs(document.delivery_date).format('YYYY-MM-DD'),
      }
    })
    : []

    return [...traslados, ...fletes, ...rentas]
  }

  const folioCount = () => {
    const traslado = documents.traslado.length !== 0 
    ? documents.traslado.length
    : 0

    const flete = documents.fletes.length !== 0
    ? documents.fletes.length
    : 0

    const renta = documents.rentas.length !== 0
    ? documents.rentas.length
    : 0    

    return {
      traslado,
      flete,
      renta
    }
  }

  const [openNewModal, setOpenNewModal] = useState(false);
  const handledModal = (event) => setOpenNewModal(event)

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const handledCreateDocument = async() => {
    const data = selectedRow.length !== 0 ? selectedRow[0] : null
    await getPDF({ id: data._id, type: data.type })
  }

  return (
  <>
    <Typography variant='h3' sx={{ margin: '2.5rem 0', fontWeight: '500' }}>      
      { empresa }      
    </Typography>    
    <Typography>
      Rentas, Traslados y Fletes
    </Typography>
    <Divider />
    <Box sx={{ height: '80px', display: 'flex', alignItems: 'center' }}>
      {
        selectedRow.length === 1 && <Button onClick={handledCreateDocument} variant="contained" color="primary">Imprimir Salida</Button>
      }
      {
        selectedRow.length > 1 && <Button variant="contained" color="primary">Descargar Excel</Button>
      }
    </Box>
    <Divider />
    <Box>
      <TableFlotillas 
        documents={documents} 
        rows={getRowData()}
        columns={columns}
        setSelectedRow={setSelectedRow}
      />
    </Box>
    <Divider />
    <Box sx={{
      marginTop: '2.5rem',
    }}>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => handledModal(true)}
        >
          Nuevo
        </Button>
    </Box>
    <NewDocument
      listVehicles={vehicles}
      refreshData={refreshData}
      open={openNewModal}
      close={() => handledModal(false)}
      empresaId={documents._id}
      folioCount={folioCount()}
    />
  </>
  )
}

export async function getServerSideProps(context) {
  const API = process.env.NEXT_PUBLIC_API
  const { empresaId } = context.query
  const documents = await fetch(`${API}/flotilla/documentos/${empresaId}`)
  .then(res => res.json())
  .then(({ documents }) => documents[0])

  const vehicles = await fetch(`${API}/flotilla/vehicles`)
  .then(res => res.json())
  .then(({ vehicles }) => vehicles)

  return {
    props: {
      empresa: documents.name,
      documents: documents,
      vehicles: vehicles
    }
  }
}

export default Empresa