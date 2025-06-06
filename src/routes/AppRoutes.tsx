

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import StokKartList from '../features/stokKart/StokKartList';
import StokKartForm from '../features/stokKart/StokKartForm';
import DepoList from '../features/depo/DepoList';
import DepoForm from '../features/depo/DepoForm';
import StokHareketList from '../features/stokHareket/StokHareketList';
import StokHareketForm from '../features/stokHareket/StokHareketForm';
import ParametreList from '../features/parametre/ParametreList';
import ParametreForm from '../features/parametre/ParametreForm';


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/stok-kart" element={<StokKartList />} />
    <Route path="/stok-kart/yeni" element={<StokKartForm />} />
    <Route path="/stok-kart/duzenle/:id" element={<StokKartForm />} />
    <Route path="/depo" element={<DepoList />} />
    <Route path="/depo/yeni" element={<DepoForm />} />
    <Route path="/depo/duzenle/:id" element={<DepoForm />} />
    <Route path="/stok-hareket" element={<StokHareketList />} />
    <Route path="/stok-hareket/yeni" element={<StokHareketForm />} />
    <Route path="/stok-hareket/duzenle/:id" element={<StokHareketForm />} />
    <Route path="/parametre" element={<ParametreList />} />
    <Route path="/parametre/yeni" element={<ParametreForm />} />
    <Route path="/parametre/duzenle/:id" element={<ParametreForm />} />
    {/* Diğer modüller buraya eklenecek */}
  </Routes>
);

export default AppRoutes;
