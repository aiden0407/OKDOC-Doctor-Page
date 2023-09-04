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

export const emailCheckOpen = async function (email) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/email-check-open`,
            method: 'POST',
            data: {
                email: email,
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}

export const emailCheckClose = async function (email, certificationNumber, emailToken) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/email-check-close`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${emailToken}`
            },
            data: {
                email: email,
                verification_number: Number(certificationNumber),
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}

export const changePassword = async function (email, newPassword, verificationToken) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/doctor/temp-password`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${verificationToken}`
            },
            data: {
                email: email,
                new_password: newPassword,
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}