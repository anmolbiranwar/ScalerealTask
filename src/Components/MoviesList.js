import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import React, { useEffect, useState } from "react";

function MoviesList() {
  const [movieList, setMovieList] = useState([]);
  const [sortedMovieList, setSortedMovieList] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    axios
      .get("https://swapi.dev/api/films/?format=json")
      .then((response) => {
        console.log(response.data.results);
        setMovieList(response.data.results);
        setSortedMovieList(response.data.results); 
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toRoman = (num) => {
    const romanNum = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let roman = "";
    for (let key in romanNum) {
      while (num >= romanNum[key]) {
        roman += key;
        num -= romanNum[key];
      }
    }
    return roman;
  };

  const handleSortChange = (event) => {
    const sortByValue = event.target.value;
    setSortBy(sortByValue);

    let sortedList = [...movieList]; 

    if (sortByValue === "episode_id") {
      sortedList.sort((a, b) => a.episode_id - b.episode_id); 
    } else if (sortByValue === "release_date") {
      sortedList.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)); 
    }

    setSortedMovieList(sortedList);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    const filteredMovies = movieList.filter((movie) =>
      movie.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSortedMovieList(filteredMovies);
  };

  const handleMovieClick = (selectedMovie) => {
    setSelectedMovie(selectedMovie);
  };

  return (
    <>
      <div className="d-flex m-2 p-2 bg-secondary">
        <div className="col-1">
          <select
            className="form-select"
            aria-label=".form-select-lg"
            onChange={handleSortChange}
            value={sortBy}
          >
            <option value="">Sort by</option>
            <option value="episode_id">Episode</option>
            <option value="release_date">Year</option>
          </select>
        </div>
        <div className="col-10 ms-2">
          <form className="form-inline">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span> 
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Type to search.."
                aria-label="Search"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-6 border border-1">
          <table className="table table-hover">
            <tbody>
              {sortedMovieList.map((item) => (
                <tr key={item.episode_id} onClick={() => handleMovieClick(item)}>
                  <td>EPISODE {item.episode_id}</td> 
                  <td>Episode {toRoman(item.episode_id)} - {item.title}</td> 
                  <td>{item.release_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-6 d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
          {selectedMovie ? (
            <div>
              <h3>Episode {toRoman(selectedMovie.episode_id)} - {selectedMovie.title}</h3>
              <p>{selectedMovie.opening_crawl}</p>
              <p>Directed by: {selectedMovie.director}</p>
            </div>
          ) : (
            <p className="text-center">No movie selected</p>
          )}
        </div>
      </div>
    </>
  );
}
export default MoviesList;
