import axios from "axios";

const axiosInastance = axios.create({
    baseURL: `http://localhost:3000`,
})

const useAxios = () => {
    return axiosInastance;
};

export default useAxios;