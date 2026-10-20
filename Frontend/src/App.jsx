import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import CreateOccasion from "./pages/CreateOccasion.jsx";
import OccasionPage from "./pages/OccasionPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import MosaicContribution from "./pages/MosaicContribution.jsx";
const App = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/create" Component={CreateOccasion} />
      <Route path="/occasion" Component={OccasionPage} />
      <Route path="*" Component={NotFound} />
      <Route path="/mosaic/:sharedCode" Component={MosaicContribution} />
    </Routes>
  )
}
export default App;