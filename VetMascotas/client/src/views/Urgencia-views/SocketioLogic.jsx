import { useEffect } from 'react';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';

const SocketLogic = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    

    useEffect(() => {
        const socket = io.connect('http://localhost:8000');

        // Escuchar evento de alerta del servidor para el administrador
        if (user.role === 'admin') {
            socket.on('nuevaSolicitud', (datoDeUrgencia) => {

                console.log("Evento nuevaSolicitud recibido:", datoDeUrgencia);
                Swal.fire('Nueva Urgencia', datoDeUrgencia.message, 'info').then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('actualizarCampo', {    
                            id: datoDeUrgencia.urgencia._id,
                            estado: 'En proceso',
                        })
                    }
                    // Redireccionar a la lista de Urgencias
                    navigate('/mascota/lista/urgencia');
                });
            });
        }

        // Mostrar alerta al usuario cuando cambia el estado de la Urgencia
        if (user.role !== 'admin') {
            socket.on('urgenciaActualizada', (urgencia) => {
                console.log("Urgencia actualizada:", urgencia);
                Swal.fire('Urgencia Atendida', urgencia, 'info').then(() => {
                    // Redireccionar a la lista de mascotas
                    navigate('/mascota/list');
                });
            });
        }

        // Limpiar el listener 
        return () => {
            socket.disconnect();
        };
    }, []); 

    return null; // Sin renderizar
};

export default SocketLogic;

