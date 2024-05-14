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

export const emailCheckClose = async function (email, certificationNumber, verifiedToken) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/email-check-close`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${verifiedToken}`
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

export const resetPassword = async function (accessToken, email, newPassword, name, birth) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/doctor/password-reset`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                email: email,
                new_password: newPassword,
                name: name,
                birth: '20240101' // 현재는 검증부는 사용하고 있지 않지만 필수항목이므로 고정해서 넣어 놓음
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}