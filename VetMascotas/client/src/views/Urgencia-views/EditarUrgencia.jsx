import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";
const EditarUrgencia = () => {
    const { id } = useParams();
    const [urgencia, setUrgencia] = useState(null);
    const [estado, setEstados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUrgencia = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/urgencia/urgencia/${id}`);
                setUrgencia(response.data);
                setEstados(["pendiente", "en proceso", "atendido"]);
            } catch (error) {
                console.error("Error al obtener la Urgencia:", error);
            }
        };
        fetchUrgencia();
        
    }, [id]);

    const handleEditUrgenciaSubmit = async (values) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/urgencia/urgencia/${id}`, values);
            console.log(response.data);
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: 'Urgencia actualizada correctamente',
            });

            navigate("/mascota/lista/urgencia");
        } catch (error) {
            console.error("Error al editar la Urgencia:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message || "Error al editar la Urgencia",
            });
        }
    };

    if (!urgencia) {
        return <div>Cargando...</div>;
    }

    const formatFecha = (dateString) => {
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
        <h1 className="text-center">Editar Urgencia</h1>
        <form
          className="container mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleEditUrgenciaSubmit(urgencia);
          }}
        >
          <div className="row justify-content-center">
            <div className="col-md-6">
            <ul className="list-group">
                <li className="list-group-item">Título: {urgencia.titulo}</li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">Fecha: {formatFecha(urgencia.fecha)}</li>
              </ul>
            
              <ul className="list-group">
                <li className="list-group-item">Direccion: {urgencia.calle}</li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">
                  Descripción: {urgencia.descripcion}
                </li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">Mascota: {urgencia.mascota}</li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">
                  Propietario: {urgencia.user_name}
                </li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">
                  <label htmlFor="estado">Estado:</label>
                  <select
                    className="form-select"
                    id="estado"
                    name="estado"
                    value={urgencia.estado}
                    onChange={(e) =>
                      setUrgencia({ ...urgencia, estado: e.target.value })
                    }
                  >
                    {estado.map((estado, index) => (
                      <option key={index} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </li>
              </ul>
              <button type="submit" className="btn btn-primary mt-3">
                Actualizar Urgencia
              </button>
              <Link
                to="/mascota/lista/urgencia"
                className="btn btn-secondary mt-3 ms-2"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
}




export default EditarUrgencia;







