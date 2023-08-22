//API
import axios from 'axios';

export const getScheduleByDoctorId = async function (doctorId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/?doctor_id=${doctorId}`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}