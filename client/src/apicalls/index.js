import axios from "axios";
// or const axios = require('axios');
// import axios from 'axios';
// const axios = require('axios');
export const axiosInstance = async (method, endpoint, payload) => {
    try {
        const response = await axios({
            method,
            url: endpoint,
            data: payload,
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
              }, 
        }
        );
        return response.data;
    } catch (error) {
        return error;
    }
};
