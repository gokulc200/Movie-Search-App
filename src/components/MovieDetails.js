import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './MovieDetails.css';

function MovieDetails() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    // Fetch movie details using the movieId parameter
    const apiKey = '9bd9009223d3fc910d3a5e26ecccb859';
    const baseUrl = 'https://api.themoviedb.org/3';
    const movieDetailsUrl = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`;

    fetch(movieDetailsUrl)
      .then((response) => response.json())
      .then((data) => {
        setMovieDetails(data);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
      });
  }, [movieId]);

  const handleClick = (movieDetails) => {
    // Toggle trailerUrl when the "trailer" image is clicked
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(null, { tmdbId: movieDetails.id })
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  const opts = {
    height: "450",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  }

  return (
    <div className="movie-details-container">
      {movieDetails && (
        <div className='movie-details-card'>
          {/* Movie poster and trailer container */}
          <div className="movie-poster-details">
            <div className='movie-image-container'>
              {/* Display the movie poster */}
              <img
                key={movieDetails.id}
                src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w300${movieDetails.poster_path}` : ''}
                alt={movieDetails.title}
              />
            </div>
            <div className='trailer-container' onClick={() => handleClick(movieDetails)}>
              {/* Display trailer video or trailer image */}
              {trailerUrl ? (
                <div className="video-container">
                  <YouTube videoId={trailerUrl} opts={opts} />
                </div>
              ) : (
                <img
                  src='https://lh3.googleusercontent.com/fHI65OB-2RfSTNwCsfH68874yXyZjDmBN5Z3LwbdjjybsLMH80CORxE4IcYurH1Fmbz52G48ApVvrVAd9KIbOcBLZ5TmdRm_ICM=s0'
                  alt='trailer'
                  className='trailer-image'
                />
              )}
            </div>
          </div>
          <div className="movie-details">
            {/* Movie details */}
            <h2>{movieDetails.title}</h2>
            <p>Release Date: {movieDetails.release_date}</p>
            {/* Display rating with star icon */}
            <div className='rating-container'>Rating: {movieDetails.vote_average} / 10<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="yellow" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg></div>
            <p>{movieDetails.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
