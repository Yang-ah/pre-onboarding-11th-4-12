import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HomePage, SearchPage } from './pages';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

const App = () => {
  const router = (
    <Route>
      <Route path="/" element={<HomePage />} />
      <Route path="search/:id" element={<SearchPage />} />
    </Route>
  );
  const rootRouter = createBrowserRouter(createRoutesFromElements(router));

  return <RouterProvider router={rootRouter} />;
};

export default App;
