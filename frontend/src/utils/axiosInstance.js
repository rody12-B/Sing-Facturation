import axios from 'axios';
import { BASE_URL } from './apiPaths';


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type" :"application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// reponse interceptrice

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                //redirection vers la page de connexion
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Erreur de serveur! Veuillez réesayer plus tard.");
            }
        }   else if (error.code === "ECONNABORTED") {
            console.error("La requete a expiré! Veuillez réesayer .");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
