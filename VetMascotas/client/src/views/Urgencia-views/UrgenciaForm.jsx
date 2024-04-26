import { Formik, Form, Field, ErrorMessage } from "formik";
import UserContext from "../../context/UserContext";
import { useContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import validationSchema from "./UrgenciaFormValidation";
import MapComponent from "./MapComponent";

const UrgenciaForm = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const id = user._id;
    //const [mascotas, setMascotas] = useState(null);

    const handleSubmit = async (
        values,
        { setSubmitting, resetForm, setErrors }
      ) => {
        console.log("submiting", values);
        try {
          const response = await axios.post("http://localhost:8000/api/urgencia/registrar-urgencia",
            values,
            { withCredentials: true }
          );
            console.log('datos', response.data);
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "¡Urgencia registrada exitosamente!",
            });
            resetForm();
            setSubmitting(false);
            navigate("/");
        } catch (error) {
            console.error("Error al registrar la Urgencia:", error);
            setSubmitting(false);
            setErrors(error.response.data);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message || "Error al registrar la Urgencia",
            });
        }
    };

    return (
        <Formik
            initialValues={{
                fecha: "",
                lat: "",
                lng: "",
                calle: "",
                descripcion: "",
                user: id,
                titulo: "", 
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <>
                    <NavBar />
                    <h1 className="text-center">Registrar Urgencia</h1>
                    <div className="row px-5">
                        <div className="col-md-6">
                            <Form>
                                <Field type="hidden" name="lat" />
                                <Field type="hidden" name="lng" />
                                <Field type="hidden" name="calle" />
                                <div className="form-group">
                                    <label htmlFor="titulo">Título</label>
                                    <Field
                                        type="text"
                                        name="titulo"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        name="titulo"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fecha">Nombre del propietario</label>
                                    <Field
                                        type="text"
                                        name="user_name"
                                        className="form-control"
                                        value={`${user.firstName} ${user.lastName}`}
                                    />
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fecha">Nombre de la mascota</label>
                                    <Field
                                        type="text"
                                        name="user_name"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <Field
                                        type="text"
                                        name="descripcion"
                                        className="form-control"
                                        component="textarea"
                                    />
                                    <ErrorMessage
                                        name="descripcion"
                                        component="textarea"
                                        className="alert alert-danger"
                                    />
                                </div>
                                
                                    <button
                                        type="submit"
                                        className="btn btn-primary mt-3"
                                        disabled={isSubmitting}
                                    >
                                        Enviar
                                    </button>
                                    <p className="text-primary mt-3">{values.calle}</p> 
                                    </Form>
                        </div>
                            <MapComponent
                                setLocationValues={(lat, lng, calle) => {
                                    // Actualizamos los valores de lat, lng y calle usando setFieldValue
                                    setFieldValue("lat", lat);
                                    setFieldValue("lng", lng);
                                    setFieldValue("calle", calle);
                                    //console.log("lat:", lat, "lng:", lng, "calle:", calle);
                                }}
                                lat={values.lat}
                                lng={values.lng}
                                street={values.calle}
                            />
                        </div>
                    </>
            )}
                </Formik>
            );
};





            export default UrgenciaForm;

