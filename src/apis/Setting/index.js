//API
import axios from 'axios';

export const getDepartments = async function () {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/departments/`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const editDoctorInfo = async function (accessToken, doctorId, data) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/doctors/${doctorId}`,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            data: data
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}