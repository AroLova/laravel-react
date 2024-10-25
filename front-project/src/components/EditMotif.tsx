import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Motif {
  name: string;
  description: string;
  transaction_id: number | null; // Assuming transaction_id can be null
}

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [values, setValues] = useState<Motif>({
    name: "",
    description: "",
    transaction_id: null, // Initialize as null
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [transactionValid, setTransactionValid] = useState<boolean>(true); // For transaction ID validation
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchMotif = async () => {
      try {
        console.log("Fetching motif with ID:", id);
        const response = await axios.get(`http://localhost:8000/api/motif/${id}`);
        const motifData = response.data;

        setValues({
          name: motifData.name,
          description: motifData.description,
          transaction_id: motifData.transaction_id || null, // Handle case where transaction_id might be null
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du motif:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchMotif();
    } else {
      console.error("ID is undefined, cannot fetch motif");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'transaction_id' ? (value === "" ? null : Number(value)) : value, // Handle transaction_id conversion
    }));

    if (name === 'transaction_id') {
      // Validate transaction ID
      validateTransactionId(value);
    }
  };

  const validateTransactionId = async (value: string) => {
    if (value === "") {
      setTransactionValid(true);
      setErrorMessage("");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/transaction/${value}`);
      if (response.status === 200) {
        setTransactionValid(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Transaction ID is invalid:", error);
      setTransactionValid(false);
      setErrorMessage("L'ID de la transaction n'est pas valide.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transactionValid) {
      console.error("Cannot submit, transaction ID is invalid");
      return;
    }

    try {
      console.log("Submitting updated motif:", values);
      await axios.put(`http://localhost:8000/api/motif/${id}`, values);
      navigate('../liste-motif');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du motif:", error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-[500px] h-auto bg-[#c7c6c5] rounded-xl shadow-xl'>
        <h2 className='text-gray-800 font-bold text-2xl'>Modifier le motif</h2>
        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col py-6'>
          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="name" className='font-bold text-xl text-gray-800'>Nom</label>
            <TextField
              id="outlined-name"
              variant="outlined"
              placeholder='Entrez le nom'
              size='small'
              name='name'
              value={values.name}
              onChange={handleChange}
              sx={{ width: "100%", paddingLeft: "10px", color: "#000" }}
            />
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
            <label htmlFor="transaction_id" className='font-bold text-xl text-gray-800'>ID de Transaction (optionnel)</label>
            <TextField
              id="outlined-transaction_id"
              variant="outlined"
              type="number"
              name="transaction_id"
              value={values.transaction_id !== null ? values.transaction_id : ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              placeholder="Entrez l'ID de transaction (si applicable)"
            />
            {!transactionValid && <p className="text-red-500">{errorMessage}</p>}
          </div>

          <button type='submit' color='success' className='w-[80%] outline-none rounded-2xl border-none bg-blue-700 text-white py-2 mt-4'>Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
