//API
import axios from 'axios';

export const getScheduleByDoctorId = async function (doctorId) {
    try {
        let options = {
            //url: `${APIURL}/treatment_appointments/?doctor_id=${doctorId}`,
            url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/?doctor_id=b1fe2079-df9b-411a-93ee-bf21cb0c77bd`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}