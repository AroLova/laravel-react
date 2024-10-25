import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import ListeTran from './components/ListeTransaction';
import AddItem from './components/AddTransaction';
import EditItem from './components/EditTransaction';
import EditMotif from './components/EditMotif';
import Home from './components/Home';
import ListeMotif from './components/ListeMotif';
import AddMotif from './components/AddMotif';
import SideBar from './navbar/NavBar';
const App: React.FC = () => {
  return (
    <BrowserRouter>
    <SideBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/liste-tran' element={<ListeTran />} />
        <Route path='/liste-motif' element={<ListeMotif />} />
        <Route path='/ajoute-motif' element={<AddMotif />} />
        <Route path='/ajoute-tran' element={<AddItem />} />
        <Route path='/edit-motif/:id' element={<EditMotif />} />
        <Route path='/edit-tran/:id' element={<EditItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
