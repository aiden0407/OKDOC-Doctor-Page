//API
import axios from 'axios';

export const getPatientInfoById = async function (loginToken, patientId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/patients/${patientId}`,
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

export const getHistoryListByPatientId = async function (patientId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/purchase_histories/?patient_id=${patientId}`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const getHistoryStatus = async function (documentKey) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/purchase_histories/?documentKey=${documentKey}`,
            method: 'GET',
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error.response;
    }
}

export const getTreatmentResults = async function (loginToken, treatmentId) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/treatments/?treatment_appointment_id=${treatmentId}`,
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