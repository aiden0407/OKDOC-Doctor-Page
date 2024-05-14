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
    const formData = new FormData();
    formData.append('department_name', data.department);
    if(data.strength.length === 1){
        formData.append('strengths[]', data.strength);
    } else {
        data.strength.forEach(function(strength) {
            formData.append('strengths', strength);
        });
    }
    if(data.field.length === 1){
        formData.append('fields[]', data.field);
    } else {
        data.field.forEach(function(field) {
            formData.append('fields', field);
        });
    }
    formData.append('self_introduction_title', data.self_introduction_title);
    formData.append('self_introduction', data.self_introduction);
    if(data.images){
        formData.append('images', data.images);
    }

    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/doctors/${doctorId}`,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}

export const changePassword = async function (accessToken, email, password, newPassword) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/doctor/change-password`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            data: {
                id: email,
                password: password,
                new_password: newPassword
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}