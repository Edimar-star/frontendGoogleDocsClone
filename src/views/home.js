import { v4 as uuidV4 } from 'uuid';
import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest, deleteRequest } from '../components/requests';
import icon from '../images/icon.png';
import addDocument from '../images/add-document.png';
import '../CSS/home.css'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import Swal from 'sweetalert2'

export default function Home({ setAuth }) {
    const navigate = useNavigate();
    const [datos, setDatos] = useState([]);
    const [datosVisibles, setDatosVisibles] = useState([]);
    const [documentFound, setDocumentFound] = useState('');

    const getAllDocuments = async () => {
        const res = await getRequest('getAllDocuments');
        if(typeof res === 'string') {
            Swal.fire(res)
        } else {
            setDatos(res);
            setDatosVisibles(res);
        }
    }

    const searchDocument = (e) => {
        e.preventDefault();
        if (documentFound) {
            const dato = datos.find(d => d.title.toLowerCase() === documentFound.toLowerCase());
            setDatosVisibles((dato) ? [dato] : []);
        } else {
            setDatosVisibles(datos);
        }
    }

    const coincidencias = (e) => {
        setDocumentFound(e.target.value);
        const dato = e.target.value;
        if (dato) {
            const con = datos.filter(d => d.title.toLowerCase().includes(dato.toLowerCase()));
            setDatosVisibles(con);
        } else {
            setDatosVisibles(datos);
        }
    }

    const logoutUser = () => {
        localStorage.setItem('user', JSON.stringify({}))
        setAuth({})
        navigate('/login');
    }

    useEffect(() => {
        getAllDocuments();
    }, []);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor);
        q.disable();
        q.setContents(datos.find(d => d._id === wrapper.id).data);
    }, [datos])

    const deleteDocument = (id) => {
        Swal.fire({
            title: 'Do you want to delete the document?',
            showCancelButton: true,
            confirmButtonText: 'Accept',
            cancelButtonText: 'Cancel',
        }).then(async r => {
            if (r.isConfirmed) {
                const data = await deleteRequest('deleteDocument/' + id);
                setDatosVisibles(datosVisibles.filter(d => d._id !== id));
                setDatos(datos.filter(d => d._id !== id));
                Swal.fire(data);
            }
        });
    }

    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <a href='/' className="navbar-brand">
                        <img src={icon} alt="google-docs" height="50" className="d-inline-block align-text-top" />
                        Documents
                    </a>
                    <form onSubmit={searchDocument} className="d-flex col-md-5 col-5 col-sm-5">
                        <input value={documentFound} onChange={coincidencias}
                            className="form-control me-2" type="search" placeholder="Search document" 
                            aria-label="Search" />
                        <button className="btn btn-outline-primary" type="submit">Search</button>
                    </form>
                    <button onClick={logoutUser} className="btn btn-outline-primary">Logout</button>
                </div>
            </nav>
            <div className='principal row justify-content-center align-items-center'>
                <div className='documentos col-md-10 col-10 col-sm-10'>
                    <a href={`/documents/${uuidV4()}`}><img src={addDocument} /></a>
                    {datosVisibles && (datosVisibles.map((dato, index) => {
                        return (
                            <div id="doc" key={index}>
                                <i onClick={() => deleteDocument(dato._id)} 
                                    style={{ marginLeft: '18vh' }} className='fas fa-trash'></i>
                                <div onClick={() => { navigate(`/documents/${dato._id}`) }}
                                    className="editor" ref={wrapperRef} id={dato._id} target="_blank"></div>
                            </div>
                        );
                    }))}
                </div>
            </div>
        </>
    );
}