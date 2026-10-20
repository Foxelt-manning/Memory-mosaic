import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home.jsx";
import CreateOccasion from "./pages/CreateOccasion.jsx";
import OccasionPage from "./pages/OccasionPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import MosaicContribution from "./pages/MosaicContribution.jsx";
import MosaicViewer from "./pages/MosaicViewer.jsx";



const App = () => {
  return (<>
    <Routes>
      
      <Route path="/" Component={Home} />
      <Route path="/create" Component={CreateOccasion} />
      <Route path="/occasion" Component={OccasionPage} />
      <Route path="*" Component={NotFound} />
      <Route path="/mosaic/:sharedCode" Component={MosaicContribution} />
      <Route
           path="/mosaic/:sharedCode/view"
          Component={MosaicViewer}
      />
    </Routes>
    <Analytics
  beforeSend={(event) => {
    const eventUrl = new URL(event.url);

    eventUrl.pathname = eventUrl.pathname.replace(
      /\/mosaic\/[^/]+/,
      "/mosaic/[sharedCode]"
    );

    return {
      ...event,
      url: eventUrl.toString(),
    };
  }}
/>
  </>
  )
}
export default App;