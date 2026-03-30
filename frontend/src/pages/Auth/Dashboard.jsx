import { useEffect, useState } from "react"
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardCharts from '../../Components/VenteBarChart';
import FinanceOverview  from '../../Components/FinanceOverview ';

const Dashboard = () => {

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const getDashboardOverView = async () =>{
        try {
            setIsLoading(true);
            const reponse = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
            if (reponse.status === 200){
                setDashboardData(reponse.data);
            }
        }catch (error) {
            console.log("error");
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDashboardOverView();
        return () =>{};
    }, []);

  return (
    
    <>
      <FinanceOverview />
      <DashboardCharts />
    </>
    
  )
}

export default Dashboard