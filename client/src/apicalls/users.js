import { axiosInstance } from ".";
// import axios form 'axios';

export const LoginUser = async(payload) => {
    const response = await axiosInstance("post", "/api/users/login", payload);
    return response;
};   

export const RegisterUser = async(payload) => {
    const response = await axiosInstance("post", "/api/users/register", payload);
    return response;
};

export const GetCurrentUser = async () =>{
    const response = await axiosInstance("get" , "/api/users/get-current-user");
    return response;
};

export const GetAllDonarsOfAnOrganisation = () => {
    return axiosInstance("get", `/api/users/get-all-donars`);
};

export const GetAllHospitalOfAnOrganisation = () => {
    return axiosInstance("get", "/api/users/get-all-hospitals");
};

export const GetAllOrganisationsOfADonar = () => {
    return axiosInstance("get", "/api/users/get-all-organisations-of-a-donar");
};

export const GetAllOrganisationsOfAHospital = () => {
    return axiosInstance("get", "api/users/get-all-organisations-of-a-hospital");
};