import { useEffect, useState } from 'react'; 
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Fab, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"

interface Column {
  id: 'id' | 'name' | 'description' | 'transaction_id' | 'created_at' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: Column[] = [
  { id: 'id', label: 'ID', minWidth: 30 },
  { id: 'name', label: 'Nom', minWidth: 80 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'transaction_id', label: 'ID de Transaction', minWidth: 16 }, // Added transaction_id column
  { id: 'created_at', label: 'Date de Création', minWidth: 80 },
  { id: 'actions', label: 'Actions', minWidth: 30, align: 'right' },
];

interface Motif {
  id: number;
  name: string;
  description: string;
  transaction_id: number | null; // Adjusted to include transaction_id
  created_at: string;
}

export default function MotifsTable() {
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const loadMotifs = async () => {
    const response = await axios.get('http://localhost:8000/api/motif');
    setMotifs(response.data);  
  };

  useEffect(() => {
    loadMotifs();
  }, []);

  console.log(motifs);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id: number) => {
    navigate(`../edit-motif/${id}`);
    console.log(`Modifier motif ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce motif ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/motif/${id}`);
        loadMotifs();
        alert('Motif supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto', borderRadius: '16px', backgroundColor: '#aaaba4' }}>
      <TableContainer style={{ backgroundColor: 'transparent' }}>
        <Table stickyHeader aria-label="sticky table" sx={{ width: '100%' }}>
          <TableHead sx={{ backgroundColor: '#ff00ff' }}>
            <TableRow sx={{ backgroundColor: '#ff00ff' }}>
              <TableCell
                align="center"
                colSpan={columns.length / 1.01}
                style={{ color: '#fff', backgroundColor: '#aaaba4' }}
              >
                Liste des Motifs
              </TableCell>
              <TableCell
                align="center"
                colSpan={columns.length / 8}
                style={{ color: '#fff', backgroundColor: '#aaaba4' }}
              >
                <Fab onClick={() => navigate(`../ajoute-motif`)} color="secondary" aria-label="add">
                  <AddIcon />
                </Fab>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: '#aaaba4',
                    color: '#fff',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: '#fff' }}>
            {motifs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((motif) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={motif.id}>
                  <TableCell>{motif.id}</TableCell>
                  <TableCell>{motif.name}</TableCell>
                  <TableCell>{motif.description}</TableCell>
                  <TableCell>{motif.transaction_id !== null ? motif.transaction_id : 'N/A'}</TableCell> {/* Display transaction_id */}
                  <TableCell>{new Date(motif.created_at).toLocaleDateString()}</TableCell> {/* Format date as needed */}
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(motif.id)} color="primary" aria-label="edit" size="large">
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(motif.id)} color='error' aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={motifs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
