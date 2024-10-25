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

interface Column {
  id: 'id' | 'amount' | 'type' | 'description' | 'dateTrans' | 'motifs' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: Column[] = [
  { id: 'id', label: 'ID', minWidth: 30 },
  { id: 'amount', label: 'Montant', minWidth: 60 },
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'dateTrans', label: 'Date de Transaction', minWidth: 80 },
  { id: 'actions', label: 'Actions', minWidth: 30, align: 'right' },
];



interface Transaction {
  id: number;
  amount: string;
  type: string;
  description: string;
  dateTrans: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const loadTransactions = async () => {
    const response = await axios.get('http://localhost:8000/api/transaction');
    setTransactions(response.data);  // Assumant que la structure de l'API correspond à celle que vous avez partagée
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  console.log(transactions);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id: number) => {
    navigate(`../edit-tran/${id}`);
    console.log(`Modifier transaction ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/transaction/${id}`);
        loadTransactions();
        alert('Transaction supprimée avec succès');
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
                Liste des Transactions
              </TableCell>
              <TableCell
                align="center"
                colSpan={columns.length / 8}
                style={{ color: '#fff', backgroundColor: '#aaaba4' }}
              >
                <Fab onClick={()=>navigate(`../ajoute-tran`)} color="secondary" aria-label="add">
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
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.dateTrans}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(transaction.id)} color="primary" aria-label="edit" size="large">
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(transaction.id)} color='error' aria-label="delete" size="large">
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
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
