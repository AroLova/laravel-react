import React, { useState, ChangeEvent, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Transaction {
  amount: string;
  type: string;
  description: string;
  dateTrans: string;
}

const AddItem: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<Transaction>({
    amount: "",
    type: "",
    description: "",
    dateTrans: "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Submitting new transaction:", values);
      await axios.post(`http://localhost:8000/api/transaction`, values);
      navigate('../liste');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>  {/* Center vertically and horizontally */}
      <div className='w-[500px] h-auto bg-[#c7c6c5] rounded-xl shadow-xl'>
        <h2 className='text-gray-800 font-bold text-2xl text-center'>Ajouter une transaction</h2> {/* Center the title */}
        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col py-6'>
          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="amount" className='font-bold text-xl text-gray-800'>Montant</label>
            <TextField
              id="outlined-amount"
              variant="outlined"
              placeholder='Entrez le montant'
              type='number'
              size='small'
              name='amount'
              value={values.amount}
              onChange={handleInputChange}
              sx={{ width: "100%", paddingLeft: "10px", color: "#000" }}
            />
          </div>
  
          <div className='flex justify-center items-start flex-col w-full px-10 mb-4'>
            <label htmlFor="type" className='font-bold text-xl text-gray-800'>Type</label>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type-label"></InputLabel>
              <Select
                labelId="type-label"
                id="outlined-type"
                name="type"
                value={values.type}
                onChange={handleSelectChange}
                displayEmpty
                sx={{ width: "100%" }}
              >
                <MenuItem value="">
                  <em>Sélectionnez un type</em>
                </MenuItem>
                <MenuItem value="entry">Entry</MenuItem>
                <MenuItem value="exit">Exit</MenuItem>
              </Select>
            </FormControl>
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
            <label htmlFor="dateTrans" className='font-bold text-xl text-gray-800'>Date de la transaction</label>
            <TextField
              id="outlined-dateTrans"
              variant="outlined"
              type="date"
              name="dateTrans"
              value={values.dateTrans}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
  
          <button type='submit' color='success' className='w-[80%] outline-none rounded-2xl border-none bg-blue-700 text-white py-2 mt-4'>Ajouter</button>
        </form>
      </div>
    </div>
  );
}  
export default AddItem;
