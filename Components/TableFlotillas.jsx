import { DataGrid } from '@mui/x-data-grid';


export default function TableFlotillas({ columns, rows, setSelectedRow }) {

  const handleRowClick = (row) => {
    setSelectedRow(row);    
  }
  
  return (
  <>   
    <div style={{ height:'50vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15]}
        checkboxSelection
        onSelectionModelChange={handleRowClick}
      />
    </div>
  </>
  );
}