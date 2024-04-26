import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    descripcion: Yup.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .required('Ingrese una descripción'),

});
export default validationSchema