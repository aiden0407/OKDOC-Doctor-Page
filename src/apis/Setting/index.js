//API
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
    formData.append('department', data.department);
    data.strength.forEach(function(strength) {
        formData.append('strength', strength);
    });
    data.field.forEach(function(field) {
        formData.append('field', field);
    });
    formData.append('self_introduction_title', data.self_introduction_title);
    formData.append('self_introduction', data.self_introduction);
    // formData.append('photo', 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg');
    // formData.append('images', {
    //     uri: data.images,
    //     type: 'image/jpeg',
    //     name: `${uuidv4()}.jpg`,
    // });

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
                email: email,
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