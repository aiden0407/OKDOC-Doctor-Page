//API
import axios from 'axios';

export const getAppointmentInfoById = async function (appointmentId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/${appointmentId}`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}