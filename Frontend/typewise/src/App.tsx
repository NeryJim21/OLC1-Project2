import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/index'
import Errores from './Components/Paginas/Errores'
import Home from './Components/Paginas/Home'


function App(){
  return(
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/Home' element={<Home/>}/>
          <Route path='/Errores' element={<Errores/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;