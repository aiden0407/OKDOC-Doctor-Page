//API
import axios from 'axios';

export const doctorLogin = async function (email, password) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/doctor/sign-in`,
            method: 'POST',
            data: {
                id: email,
                password: password,
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}

export const getDoctorInfoByCredential = async function (accessToken) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/doctors`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}