import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import "../App.css";

const TMDB_API_KEY = "0af887b0a50b1e0175fb83b9b1c7e12f"; // Replace with your actual API key
const TMDB_API_URL = "https://api.themoviedb.org/3/movie/popular";

const MovieCard = ({
  title,
  posterPath,
  originalTitle,
  overview,
  releaseDate,
}) => {
  const [hovered, setHovered] = useState(false);
  const props = useSpring({
    opacity: hovered ? 1 : 0.8,
    transform: hovered ? "scale(1.01)" : "scale(1)",
  });

  return (
    <animated.div
      style={props}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className=" mb-4 p-4 border rounded-md transition-transform duration-100 ease-in-out transform hover:shadow-lg"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${posterPath}`}
        alt={title}
        className="mb-2 w-full h-auto rounded-md"
      />
      <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
      <p className="text-white">
        <strong className="text-red-600">Release Date:</strong> {releaseDate}
      </p>
      <p className="text-white">
        <strong className="text-red-600">Original Title :</strong>{" "}
        {originalTitle}
      </p>
      <p className="text-white">
        <strong className="text-red-600"> Overview :</strong> {overview}
      </p>
    </animated.div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Initial page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${TMDB_API_URL}?api_key=${TMDB_API_KEY}&page=${page}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setMovies((prevMovies) => [...prevMovies, ...result.results]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        // User has scrolled to the bottom, load more movies
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="relative bg-gray-900">
      <div className="container mx-auto ">
        <h2 className="text-5xl font-bold  py-6 logo text-red-600 mx-10">
          MovieMix
        </h2>
        <div className=" w-[95vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              originalTitle={movie.original_title}
              overview={movie.overview}
              releaseDate={movie.release_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
