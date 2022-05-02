import React, { useState } from 'react';
import { Typography, Box, Divider, Button } from '@mui/material'
import TableFlotillas from '../Components/TableFlotillas'
import NewDocument from '../Components/Modal/NewDocument';
import { useRouter } from 'next/router'
import dayjs from 'dayjs';

function Empresa({ empresa, documents }){
  
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true
    },
    {
      field: 'folio',
      headerName: 'Folio',
      width: 100,
    },
    {
      field: 'type',
      headerName: 'Tipo Documento',
      width: 200,
    },
    {
      field: 'request_date',
      headerName: 'Fecha Solicitud',
      width: 150,
      type: 'date',
    },
    {
      field: 'delivery_date',
      headerName: 'Fecha Disperción',
      width: 150,
      type: 'date',
    },
    {
      field: 'driver',
      headerName: 'Conductor',
      width: 200,
    },
    {
      field: 'document_id',
      headerName: 'Folio ADMINPAQ',
      width: 150,
      sortable: false,
    },
    {
      field: 'project_id',
      headerName: 'Folio Proyecto',
      width: 150,
      sortable: false,
    },
    {
      field: 'route',
      headerName: 'Ruta',
      width: 150,
      sortable: false,
    },

  ];

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
    return [...traslados, ...fletes]
  }

  const folioCount = () => {
    const traslado = documents.traslado.length !== 0 
    ? documents.traslado.length
    : 0

    const flete = documents.fletes.length !== 0
    ? documents.fletes.length
    : 0

    return {
      traslado,
      flete,
    }
  }

  const [openNewModal, setOpenNewModal] = useState(false);
  const handledModal = (event) => setOpenNewModal(event)

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  return (
  <>
    <Typography variant='h3' sx={{ margin: '2.5rem 0', fontWeight: '500' }}>      
      Traslados y Fletes
    </Typography>
    <Typography>
      { empresa }
    </Typography>
    <Divider />
    <Box sx={{ height: '80px', display: 'flex', alignItems: 'center' }}>
      {
        selectedRow.length === 1 && <Button variant="contained" color="primary">Imprimir Salida</Button>
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
  
  return {
    props: {
      empresa: documents.name,
      documents: documents
    }
  }
}

export default Empresa