import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from 'react-loading';
import { CSSTransition } from 'react-transition-group';
import './Home.css';

function Home() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('popularity.desc'); // Default filter
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add isLoading state

    // Fetch movies based on the selected filter and current page
    const fetchMovies = (sortBy) => {
        const apiKey = '9bd9009223d3fc910d3a5e26ecccb859';
        const baseUrl = 'https://api.themoviedb.org/3';
        const popularMoviesUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=${sortBy}&page=${currentPage}`;

        fetch(popularMoviesUrl)
            .then((response) => response.json())
            .then((data) => {
                setMovies(data.results);
                setTotalPages(data.total_pages);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        const newFilter = event.target.value;
        setSelectedFilter(newFilter);
        fetchMovies(newFilter);
    };

    // Handle search button click
    const handleSearch = () => {
        // Reset pagination when performing a search
        setCurrentPage(1);

        if (searchQuery.trim() !== '') {
            setIsLoading(true);
            const apiKey = '9bd9009223d3fc910d3a5e26ecccb859';
            const baseUrl = 'https://api.themoviedb.org/3';
            const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${currentPage}`;

            fetch(searchUrl)
                .then((response) => response.json())
                .then((data) => {
                    setMovies(data.results);
                    setTotalPages(data.total_pages);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        // Fetch movies based on the selected filter and current page
        fetchMovies(selectedFilter);
        // eslint-disable-next-line
    }, [currentPage, selectedFilter, searchQuery]);

    return (
        <div className="home-container">
            <h1>Movie Search App</h1>
            <div className="features-container">
                {/* Search container */}
                <div className='search-container'>
                    <div className='movie-description'>
                        <p>MOVIE NAME</p>
                    </div>
                    <div className='search-input-container'>
                        {/* Input for movie search */}
                        <input
                            type="text"
                            placeholder="Enter movie name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='input-container'
                        />
                        {/* Button to trigger search */}
                        <button onClick={handleSearch} className='search-btn'>Search</button>
                    </div>
                </div>
                {/* Filter container */}
                <div className="filter-container">
                    <label htmlFor="filter">Sort By </label>
                    <select id="filter" value={selectedFilter} onChange={handleFilterChange}>
                        <option value="popularity.desc">Popularity - High to Low</option>
                        <option value="popularity.asc">Popularity - Low to High</option>
                        <option value="vote_average.desc">Rating - High to Low</option>
                        <option value="vote_average.asc">Rating - Low to High</option>
                    </select>
                </div>
            </div>

            {/* Movie list */}
            <div className="movie-list">
                {isLoading ? ( // Display Loading component while fetching data
                    <div className="loading-container">
                        <Loading type="spin" color="#007bff" />
                    </div>
                ) : (
                    movies.map((movie) => (
                        <CSSTransition key={movie.id} classNames="fade" timeout={300}>
                            <div key={movie.id} className="movie-item">
                                {/* Movie item content */}
                                <div className="movie-poster">
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : ''}
                                        alt={movie.title}
                                    />
                                </div>
                                <div className="movie-details">
                                    <h3>{movie.title}</h3>
                                    <p>Release Date: {movie.release_date}</p>
                                    {/* Display movie rating with star icon */}
                                    <div className='rating-container'>
                                        Rating: {movie.vote_average} / 10
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="yellow" role="presentation">
                                            <path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path>
                                        </svg>
                                        <span class="_2_R_DZ">&nbsp;({movie.vote_count})</span>
                                    </div>
                                    {/* Link to view movie details */}
                                    <Link to={`/movie/${movie.id}`}><button className='view-btn'>View Details</button></Link>
                                </div>
                            </div>
                        </CSSTransition>
                    ))
                )}

            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='pagination-btn'
                >
                    Previous
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='pagination-btn'
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
