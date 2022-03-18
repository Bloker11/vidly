import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getMovies} from '../src/services/fakeMovieService'
import {useState, useEffect} from 'react'

const getLocalStorage = () =>{
  let list = localStorage.getItem('movies')
  if(list){
  return JSON.parse(localStorage.getItem('movies'))
  }
  else{
    return getMovies();
  }
}

function App() {
 const [movies,setMovies] = useState(getLocalStorage)
 const [name, setName] = useState('');
 const [movieID,setMovieID] = useState('');
 const [movieRate, setMovieRate] = useState('');
 const [isEditing, setIsEditing] = useState(false);
 const [editID, setEditID] = useState(null);
 const [search, setSearch] = useState('');
 const [alert,setAlert] = useState({msg:'',type:''})
 const [movieGenre,setMovieGenre] = useState('');

 useEffect(() => {
  const timeout = setTimeout(() =>{
    setAlert({msg:'',type:''});
  },3000)

  return () => clearTimeout(timeout)
 },[movies])

 useEffect(()=>{
   localStorage.setItem('movies',JSON.stringify(movies))
 },[movies])
 
 const handleSubmit = (e) => {
   e.preventDefault();
  if(!name || !movieRate || !movieGenre){
    setAlert({show:true,msg:'please enter a value',type:'alert alert-danger'});
    
  }else if(isEditing && name && movieRate && movieGenre){
    setAlert({msg:'item edited successfuly',type:'alert alert-success'})
    setMovies(movies.map((movie)=>{
      if (movie._id === editID){
        return {...movie,title: name, dailyRentalRate: movieRate, genre: {_id:movieID, name: movieGenre} }
      }
      return movie;
    }))
    setIsEditing(false);
    setMovieID(null);
    setName('');
    setMovieRate('');
    setMovieGenre('');
  }
  else{
    const newItem = {_id: new Date().getTime().toString(), dailyRentalRate: movieRate,title: name, genre: { _id: movieID, name: movieGenre }, numberInStock: 0}
      setAlert({msg:'item added successfuly',type:'alert alert-success'})
      setMovies([ ...movies, newItem ])
      setIsEditing(false);
      setMovieID('');
      setName('');
      setMovieRate('');
      setMovieGenre('');
  }
 }

 const handleRemove = (e) =>{
   const id = e.target.getAttribute('id')
  const newMovies = movies.filter((movie)=>id!==movie._id);
  setMovies(newMovies);
  setAlert({msg:'item removed successfuly',type:'alert alert-danger'})
 }

 const handleEdit = (id) => {
  const specificItem = movies.find((movie)=>movie._id === id);
  setIsEditing(true);
  setMovieID(id);
  setName(specificItem.title);
  setMovieRate(specificItem.dailyRentalRate);
  setEditID(id);
  setMovieGenre(specificItem.genre.name);
  
 }

 
   
 

 
  return (
    <article className="App">
      <p className={alert.type}>{alert.msg}</p>
      <input type="text" placeholder="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
      


      <h1>Number of items:{movies.length}</h1>
      
        
        <form>
        <div className="form-row">
          <div className="col-3">
            <input type="text" className="form-control" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          
          <div className="col-3">
            <input type="text" className="form-control" placeholder="genre" value={movieGenre} onChange={(e)=>setMovieGenre(e.target.value)}/>
          </div>
          <div className="col-3">
            <input type="text" className="form-control" placeholder="rate" value={movieRate} onChange={(e)=>setMovieRate(e.target.value)}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing?"edit":"add"}</button>
        </div>
        </form>
        
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Number</th>
            <th scope="col">ID</th>
            <th scope="col">Movie</th>
            <th scope="col">rate</th>
            <th scope="col">genre</th>
          </tr>
        </thead>
        <tbody>
          {movies.filter(movie => movie.title.toLowerCase().includes(search.toLowerCase()) || movie.dailyRentalRate.toLowerCase().includes(search) || movie.genre.name.toLowerCase().includes(search)).map((movie,index) => {
            const {_id, title,dailyRentalRate,genre} = movie;
            return (
              <tr key={index}>
                <th scope = "row">{index+1}</th>
                <td>{_id}</td>
                <td>{title}</td>
                <td>{dailyRentalRate}</td>
                <td>{genre.name}</td>
                <tr><button className="btn btn-danger" id={_id} onClick={handleRemove}>delete</button></tr>
                <tr><button className="btn btn-success" onClick={()=>handleEdit(_id)}>edit</button></tr>
              </tr>
            )
          })}
        </tbody>
        </table>
      </article>
  );
}

export default App;
