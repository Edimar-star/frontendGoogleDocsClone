import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from 'react';
import '../CSS/textEditor.css'
import { io } from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import img from '../images/icon.png'
import { getRequest, putRequest, REACT_APP_URL } from '../components/requests';
import Swal from 'sweetalert2'

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: "super" }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean'],
]

export default function TextEditor() {
    const navigate = useNavigate()
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id: documentId } = useParams();
    const [titulo, setTitulo] = useState('');
    const [user, setUser] = useState();

    const getTitulo = async () => {
        const data = await getRequest(`titulo/${documentId}`);
        if(typeof data === 'string') {
            Swal.fire(data).then(() => navigate('/'))
        } else {
            setUser(data.user);
            setTitulo(data.title);
        }
    }

    useEffect(() => {
        getTitulo();
        const s = io(REACT_APP_URL, { transports: ['websocket'] });
        setSocket(s);

        return () => {
            s.disconnect();
        }
    }, [socket]);

    useEffect(() => {
        if (socket == null || quill == null || user == null) return;

        const handler = document => {
            setTitulo(document.title);
            quill.setContents(document.data);
            quill.enable();
        }
        socket.once('load-document', handler)
        socket.emit('get-document', { documentId, email: user.email });

        return () => {
            socket.off('load-document', handler);
        }
    }, [socket, quill, documentId, user]);

    useEffect(() => {
        if (socket == null) return;

        const handler = (title) => {
            setTitulo(title);
        }

        socket.on('change-title', handler)

        return () => {
            socket.off('change-title', handler)
        }
    }, [socket])

    useEffect(() => {
        if (socket == null || quill == null || user == null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', { title: titulo, data: quill.getContents() });
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill, user, titulo])

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        }
        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes', handler);
        }
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;

            socket.emit('send-changes', delta);
        }
        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler);
        }
    }, [socket, quill]);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
        q.disable();
        q.setText('Loading...');
        setQuill(q);
    }, [])

    const setNewTitle = async e => {
        e.preventDefault();
        const res = await putRequest('new-title', { title: titulo, id: documentId, data: quill.getContents() });
        socket.emit('new-title', res);
    }

    return (
        <>
            <form onSubmit={setNewTitle} className="nav align-items-center">
                <a className="navbar-brand" href="/Home"><img src={img} alt="google-docs" height="40" /></a>
                <input type='text' value={titulo} onChange={e => setTitulo(e.target.value)} />
                <button type="submit" className='btn btn-primary'>new tittle</button>
            </form>
            <div className="container" ref={wrapperRef}></div>
        </>
    );
}