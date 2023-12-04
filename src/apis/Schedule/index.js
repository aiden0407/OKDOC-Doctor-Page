//API
import axios from 'axios';

export const getScheduleByDoctorId = async function (loginToken, doctorId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/?doctor_id=${doctorId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const getBiddingInformation = async function (loginToken, biddingId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/biddings/${biddingId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const openSchedule = async function (loginToken, doctorId, schedule) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/doctors/${doctorId}/schedule/open`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${loginToken}`
            },
            data: schedule
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const closeSchedule = async function (loginToken, doctorId, open_at) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/doctors/${doctorId}/schedule/close`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${loginToken}`
            },
            data: {
                open_at: open_at
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}