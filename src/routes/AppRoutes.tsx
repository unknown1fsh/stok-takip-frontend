

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import StokKartList from '../features/stokKart/StokKartList';
import StokKartForm from '../features/stokKart/StokKartForm';
import DepoList from '../features/depo/DepoList';
import StokHareketList from '../features/stokHareket/StokHareketList';
import ParametreList from '../features/parametre/ParametreList';


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/stok-kart" element={<StokKartList />} />
    <Route path="/stok-kart/yeni" element={<StokKartForm />} />
    <Route path="/stok-kart/duzenle/:id" element={<StokKartForm />} />
    <Route path="/depo" element={<DepoList />} />
    <Route path="/stok-hareket" element={<StokHareketList />} />
    <Route path="/parametre" element={<ParametreList />} />
    {/* Diğer modüller buraya eklenecek */}
  </Routes>
);

export default AppRoutes;
