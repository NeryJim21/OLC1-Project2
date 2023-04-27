import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import TabBar from './Components/Tabs/TabBar'
import Tokens from './Components/Table/Tokens/Tokens'
import Errors from './Components/Table/Errors/Errors'
import AST from './Components/AST/ast'

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<TabBar />} />
                <Route path="/Errores" element={<Errors />} />
                <Route path="/Tokens" element={<Tokens />} />
                <Route path="/AST" element={<AST />} />
            </Routes>
        </Router>
    );
}

export default App;