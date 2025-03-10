// service base
export async function fetchData(url: string) {
  const res = await fetch(url);
  return await res.json();
}
// user service
export default async function getMovies(query: string = "") {
  const movies = await fetchData(`${BASE_URL}&s=${query}`);
  const mappedMovies = movies.Search.map(
    (movie: any) => new MovieModel(movie.Title, movie.Poster, movie.imdbID)
  );
  localStorage.setItem("movies", JSON.stringify(mappedMovies));
  return mappedMovies;
}
