import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import './App.css';

function App() {

  return (
    <div className="App">
      {/* Define the routes using the React Router "Routes" component */}
      <Routes>
        {/* Route for the home page */}
        <Route exact path="/" element={<Home />} />
        {/* Route for displaying movie details based on movieId */}
        <Route exact path="/movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
