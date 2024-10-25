import React, { useState, ChangeEvent, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface Motif {
  name: string;
  description: string;
  transaction_id: number | null; // Assuming transaction_id is optional or can be null
}

const AddMotif: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<Motif>({
    name: "",
    description: "",
    transaction_id: null, // Initialize as null or provide a default value
  });

  const [error, setError] = useState<string | null>(null); // State to hold error messages

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setError(null); // Clear error when input changes
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (values.transaction_id) {
      try {
        // Check if the transaction ID exists
        const response = await axios.get(`http://localhost:8000/api/transaction/${values.transaction_id}`);
        if (response.status !== 200) {
          throw new Error("Transaction ID does not exist.");
        }
      } catch (error) {
        setError("ID de transaction invalide."); 
        console.log(error)// Set error message
        return; // Exit early if the transaction ID is invalid
      }
    }

    try {
      console.log("Submitting new motif:", values);
      await axios.post(`http://localhost:8000/api/motif`, values);
      navigate('../liste-motif');
    } catch (error) {
      console.error("Erreur lors de l'ajout du motif:", error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>  {/* Center vertically and horizontally */}
      <div className='w-[500px] h-auto bg-[#c7c6c5] rounded-xl shadow-xl'>
        <h2 className='text-gray-800 font-bold text-2xl text-center'>Ajouter un Motif</h2> {/* Center the title */}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              sx={{ width: "100%" }}
              placeholder="Entrez l'ID de transaction (si applicable)"
            />
          </div>

          {error && <div className='text-red-600 text-sm'>{error}</div>} {/* Display error message */}
  
          <button type='submit' color='success' className='w-[80%] outline-none rounded-2xl border-none bg-blue-700 text-white py-2 mt-4'>Ajouter</button>
        </form>
      </div>
    </div>
  );
}

export default AddMotif;
