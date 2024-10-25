import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Transaction {
  amount: string;
  type: string;
  description: string;
  dateTrans: string;
}

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [values, setValues] = useState<Transaction>({
    amount: "",
    type: "",
    description: "",
    dateTrans: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log("Fetching transaction with ID:", id);
        const response = await axios.get(`http://localhost:8000/api/transaction/${id}`);
        const transactionData = response.data;

        const formattedDate = new Date(transactionData.dateTrans).toISOString().split('T')[0];

        setValues({
          ...transactionData,
          dateTrans: formattedDate,
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de la transaction:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    } else {
      console.error("ID is undefined, cannot fetch transaction");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Submitting updated transaction:", values);
      await axios.put(`http://localhost:8000/api/transaction/${id}`, values);
      navigate('../liste');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la transaction:", error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-[500px] h-auto bg-[#c7c6c5] rounded-xl shadow-xl'>
        <h2 className='text-gray-800 font-bold text-2xl'>Modifier la transaction</h2>
        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col py-6'>
          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="amount" className='font-bold text-xl text-gray-800'>Montant</label>
            <TextField
              id="outlined-amount"
              variant="outlined"
              placeholder='Entrez le montant'
              size='small'
              name='amount'
              value={values.amount}
              onChange={handleChange}
              sx={{ width: "100%", paddingLeft: "10px", color: "#000" }}
            />
          </div>
          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="type" className='font-bold text-xl text-gray-800'>Type</label>
            <TextField
              id="outlined-type"
              variant="outlined"
              select
              name="type"
              value={values.type}  // Valeur récupérée de l'API
              onChange={handleChange}
              sx={{ width: "100%", paddingLeft: "10px", color: "#000" }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </TextField>
          </div>

          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="description" className='font-bold text-xl text-gray-800'>Description</label>
            <TextField
              id="outlined-description"
              variant="outlined"
              placeholder='Entrez la description'
              size='small'
              name='description'
              value={values.description}
              onChange={handleChange}
              sx={{ width: "100%", paddingLeft: "10px", color: "#000" }}
            />
          </div>

          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="dateTrans" className='font-bold text-xl text-gray-800'>Date de la transaction</label>
            <TextField
              id="outlined-dateTrans"
              variant="outlined"
              type="date"
              name="dateTrans"
              value={values.dateTrans}  // Valeur de la date récupérée de l'API
              onChange={handleChange}
              sx={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,  // Permet de garder le label au-dessus du champ
              }}
            />
          </div>

          <button type='submit' color='success' className='w-[80%] outline-none rounded-2xl border-none bg-blue-700 text-white py-2 mt-4'>Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
