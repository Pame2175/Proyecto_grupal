import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ListMascota from './views/ListMascota';
import AddMascotas from './views/AddMascotas';
import Container from './components/Contenedor';
import LoginRegister from './views/LoginRegister';
import UserContext from './context/UserContext';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import EditMascotas from './views/EditMascota';
import AgendarMascotas from './views/AgendarMascotas';
import InfoVeterinaria from './views/InfoVeterinaria';
import Register from './views/Register';
import VerCitas  from './views/VerCitas';
import EditarCitas  from './views/EditarCitas';
import Calendar from './views/calendar';
import ListEvent from './views/ListEvent';


//urgencias
import UrgenciaForm from './views/Urgencia-views/UrgenciaForm';
import UrgenciaList from './views/Urgencia-views/UrgenciaList';
import EditarUrgencia from './views/Urgencia-views/EditarUrgencia';
//socket.io
import SocketLogic from './views/Urgencia-views/SocketioLogic';


const App = () => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const userInfo = userDetails ? userDetails : null;
    const [user, setUser] = useState(userInfo)

    const setUserKeyValue = (key, value) => {
        setUser({ ...user, [key]: value })
    }

    const contextObject = {
        user,
        setUser,
        setUserKeyValue
    }
    

    return (
        <UserContext.Provider value={contextObject}>
            <SocketLogic /> 
            <Routes>
                <Route path="/" element={<Navigate to="/mascota/list" />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegister />
                    </PublicRoute>
                    
                } />
                 <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                    
                } />
                <Route path="/mascota/" element={
                    <PrivateRoute>
                        <Container />
                    </PrivateRoute>
                }>
                    <Route path="list" element={<ListMascota />} />
                    <Route path="add" element={<AddMascotas />} />
                    <Route path="citas" element={<VerCitas />} />
                    <Route path="cita/edit/:citaId" element={<EditarCitas/>} />
                    <Route path="editar/:id" element={<EditMascotas />} />
                    <Route path="cita/:id" element={<AgendarMascotas />} />
                    <Route path="infoVeterinaria" element={< InfoVeterinaria />} />
                    <Route path="/mascota/calendar/event" element={<Calendar />} />
                    <Route path="/mascota/listevent" element={<ListEvent/>} />
                    
                </Route>
                
                <Route path="/mascota/urgencia/crear" element={
                <PrivateRoute>
                <UrgenciaForm />
                </PrivateRoute>
            } />

                <Route path="/mascota/lista/urgencia" element={
                <PrivateRoute>
                <UrgenciaList />
                </PrivateRoute>
            } />

                <Route path="/mascota/urgencia/:id" element={
                <PrivateRoute>
                <EditarUrgencia />
                </PrivateRoute>
            } />
                
                
                
                
            </Routes>
        </UserContext.Provider>
    )
};

export default App;
