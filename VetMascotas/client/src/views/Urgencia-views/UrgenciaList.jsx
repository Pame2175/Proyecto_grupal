import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";
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

    const handleDelete = async (id) => {
      try {
          const confirmDelete = await Swal.fire({
              icon: "warning",
              title: "¿Estás seguro?",
              text: "Esta acción no se puede deshacer.",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, eliminar"
          });
  
          if (confirmDelete.isConfirmed) {
              await axios.delete(`http://localhost:8000/api/urgencia/urgencia/${id}`);
              const updatedUrgencias = urgencias.filter((urgencia) => urgencia._id !== id);
              setUrgencias(updatedUrgencias);
  
              Swal.fire({
                  icon: "success",
                  title: "¡Éxito!",
                  text: "Urgencia eliminada correctamente",
              });
          }
      } catch (error) {
          console.error("Error al eliminar la Urgencia:", error);
      }
  };
//ordenar las urgencias por mas reciente a mas antiguo
  const urgenciasOrdenadas = urgencias.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaB - fechaA;
  })

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
              {urgenciasOrdenadas.map((urgencia) => (
                <tr key={urgencia._id}>
                  <td style={{ fontWeight: 'bold' }}>{urgencia.titulo}</td>
                  <td className="small">{formatDate(urgencia.fecha)}</td>
                  <td className="text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{urgencia.descripcion}</td>
                  <td className="text-muted">{urgencia.mascota}</td>
                  <td className="text-muted">{urgencia.calle}</td>
                  <td className="text-muted">{urgencia.estado}</td>
                  <td>
                    <Link
                      to={`/mascota/urgencia/${urgencia._id}`}
                      className="btn btn-primary"
                    >
                      Editar
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(urgencia._id)}
                    >
                      Eliminar
                    </button>
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


