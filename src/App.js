import Auth from "./views/auth";
import Home from "./views/home";
import TextEditor from "./views/textEditor";
import PageNotFound from "./views/pageNotFound";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './components/authProvider';

export default function App() {
  const { auth, setAuth } = AuthProvider().props.value
  const elements = Object.keys(auth).length > 0
    
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={elements ? <Navigate replace to="/" /> : <Auth setAuth={setAuth} />} />
        <Route path="/" element={elements ? <Home setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/documents/:id" element={elements ? <TextEditor /> : <Navigate replace to="/login" />} />
        <Route path="*" exact element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
