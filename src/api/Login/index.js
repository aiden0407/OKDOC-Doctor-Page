//API
import axios from 'axios';

export const doctorLogin = async function (id, password) {
    try {
        let options = {
            url: `${process.env.REACT_APP_API_HOST}/authentication/sign-in`,
            method: 'POST',
            data: {
                id: id,
                password: password,
            }
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        throw error;
    }
}