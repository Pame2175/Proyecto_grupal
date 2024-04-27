import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";

const UrgenciaList = () => {
    const [urgencias, setUrgencias] = useState([]);

    useEffect(() => {
        const fetchUrgencias = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/urgencia/lista-urgencias");
                setUrgencias(response.data);
            } catch (error) {
                console.error("Error al obtener las Urgencias:", error);
            }
        };

        fetchUrgencias();
    }, []);

    const formatDate = (dateString) => {
        const fecha = new Date(dateString);
        return fecha.toLocaleDateString(
            "es-ES",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            }
        );
    };

    return (
        <div>
            <NavBar />
        <div className="container">
          <h1 className="text-primary mt-3 mb-3 text-center">Lista de Urgencias</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Fecha</th>
                <th>Descripcion</th> 
                <th>Mascota</th>
                <th>Direccion</th>
                <th>Estado</th>
                <th>Acciones</th>
               
              </tr>
            </thead>
            <tbody>
              {urgencias.map((urgencia) => (
                <tr key={urgencia._id}>
                  <td style={{ fontWeight: 'bold' }}>{urgencia.titulo}</td>
                  <td className="small">{formatDate(urgencia.fecha)}</td>
                  <td className="text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{urgencia.descripcion}</td>
                  <td className="text-muted">{urgencia.mascota}</td>
                  <td className="text-muted">{urgencia.calle}</td>
                  <td className="text-muted">{urgencia.estado}</td>
                  <td>
                    <Link
                      to={`/urgencia/${urgencia._id}`}
                      className="btn btn-primary"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      );
};

export default UrgenciaList;


