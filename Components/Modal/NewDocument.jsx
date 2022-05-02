/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useMemo } from 'react'
import { Modal, TextField, Box, InputLabel, Select, MenuItem, FormControl, Button } from '@mui/material'
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


const API = process.env.NEXT_PUBLIC_API

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',  
  width: "500px",
  height: "500px",
  bgcolor: 'background.paper',
  borderRadius: '4px',
  overflow: 'auto',
  boxShadow: 24,    pt: 2,
  px: 4,
  pb: 3,
};

const flexColum = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  gap: '1rem',
  padding: '0.25rem',
}


const NewDocument = ({ open, close, empresaId, folioCount, refreshData }) => {

  const [type, setType] = useState('');
  const { register, handleSubmit, reset } = useForm();
  const [saveData, setSaveData] = useState(false)

  const nextFolio = useMemo(() => {
    return folioCount[type] + 1
  }, [type])

  const handleClose = () => {
    close();
    reset();
    setType('');
  }
  
  const onSubmit = async(data) => {

    if(!type){
      toast.info('Selecciona un tipo de documento')
      return
    }

    setSaveData(true)
    const folio = nextFolio
    const payload = {
      ...data,
        folio,
        bussiness_cost: empresaId,
      }
    await fetch(`${API}/flotilla/insert?type=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .catch(err => {
      toast.error(err.message)
      setSaveData(false)
    })
    .finally(res => {
      toast.success('Documento guardado')
      setSaveData(false)
      refreshData()
      handleClose()
    })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
        <Box sx={{ ...style }}> 
          <form style={{
            paddingBottom: '1rem',
          }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box sx={{ ...flexColum }}>
              <FormControl fullWidth>
                <InputLabel id="type">Tipo de documento</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={type}
                  label="Tipo de documento"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="traslado">Traslado</MenuItem>
                  <MenuItem value="flete">Flete</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{
                overflow: '',
              }}>

              </Box>
              <TextField
                label="Vehiculo"
                name="vehicle"
                id="vehicle"
                variant="outlined"
                fullWidth
                { ...register("vehicle", { required: true }) }
              />
              <TextField
                label="Fecha de solicitud"
                name="request_date"
                id="request_date"
                variant="outlined"
                fullWidth
                type="date"
                value={dayjs().format('YYYY-MM-DD')}
                { ...register("request_date", { required: true }) }
              />
              <TextField
                label="Fecha de disperción"
                name="delivery_date"
                value={dayjs().format('YYYY-MM-DD')}
                id="delivery_date"
                variant="filled"
                fullWidth
                type="date"
                { ...register("delivery_date", { required: true }) }
              />
              <TextField
                label="Conductor"
                name="driver"
                id="driver"
                variant="outlined"
                fullWidth
                { ...register("driver", { required: true }) }
              />
              <TextField
                label="Ruta"
                name="route"
                id="route"
                variant="outlined"
                fullWidth
                { ...register("route", { required: true }) }
              />
              <TextField
                label="Kilometraje de salida"
                name="kilometer_out"
                id="kilometer_out"
                variant="outlined"
                type="number"
                fullWidth
                { ...register("kilometer_out", { required: true }) }
              />
              <TextField
                label="Kilometraje de llegada"
                name="kilometer_in"
                id="kilometer_in"
                variant="outlined"
                type="number"
                fullWidth
                { ...register("kilometer_in", { required: true }) }
              />
              <TextField
                label="Nivel de combustible"
                name="fuel_level"
                id="fuel_level"
                variant="outlined"
                type="number"
                fullWidth
                { ...register("fuel_level", { required: true }) }
              />
              <TextField
                label="Folio Documento de traslado"
                name="document_id"
                id="document_id"
                variant="outlined"
                type="text"
                fullWidth
                { ...register("document_id", { required: true }) }
              />
              <TextField
                label="Folio proyecto"
                name="project_id"
                id="project_id"
                variant="outlined"
                type="text"
                fullWidth
                { ...register("project_id", { required: true }) }
              />
              <TextField
                label="Número de tarjeta de combustible"
                name="fuel_card"
                id="fuel_card"
                variant="outlined"
                fullWidth
                { ...register("fuel_card", { required: true }) }
              />
              <TextField
                maxRows={4}
                label="Observaciones"
                name="observations"
                id="observations"
                variant="outlined"
                fullWidth
                type="textArea"
                { ...register("observations", { required: true }) }
              />            
            </Box>
            <Box sx={{ display: 'flex', gap: "1.25rem", margin: '10px', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  width="100%"
                  type="submit"
                  disabled={saveData}
                  >
                    Guardar
                </Button>
                <Button
                  variant="contained"
                  width="100%"
                  onClick={handleClose}
                  >
                    Cerrar
                </Button>
            </Box>
          </form>
        </Box>

    </Modal>
    
  )
}

export default NewDocument;
