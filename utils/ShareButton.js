import { Button } from '@mui/material'

const ShareButton = ({ id, type }) => {
  const shareData = {
    title: "Flotilla",
    text: 'Recuerda que el link de descarga es único para cada documento y puedes consultarlos las veces que quieras.',
    url: `https://logistica-chi.vercel.app/flotilla/${id}/${type}`,
  }

  const handleShare = async() => {
    try{
      await navigator.share(shareData)    
    }catch(error){
      console.log(error)
    }
  }
  
  return <Button variant='contained' color="secondary" onClick={handleShare}>
    Compartir
  </Button>
}

export default ShareButton