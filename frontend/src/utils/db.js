import {
    Search,
    Users,
    FileText,
    MessageSquare,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus,
    BarChart,
} from "lucide-react"

export const jobSeekerFeatures = [
    {
        icon : Search,
        title : "Smart job matching",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : FileText,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : MessageSquare,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : Award,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
];

export const employerFeatures = [
    {
        icon : Users,
        title : "Smart job matching",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : BarChart,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : Shield,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
    {
        icon : Clock,
        title : "Resumé sur nos services",
        description :" Quelques informations sur les methodes de facturation avec notre applicaiton"
    },
];
// navigation configurattion des elements

export const NAVIGATION_MENU = [
    {id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard},
    {id: "post-job", name: "Post Job", icon: Plus},
    {id: "managee-jobs", name: "Manage Jobs", icon: Briefcase},
    {id: "company-profile", name: "Company Profile", icon: Building2},
];


//categories et type de travail 
export const CATEGORIES =[
    {value: "Ingenieur" , label:"Ingenieur"},
    {value: "Developpeur" , label:"Developpeur"},
    {value: "Enseignant" , label:"Enseignant"},
    {value: "Historien" , label:"Historien"},
    {value: "Geographe" , label:"Geographe"},
    {value: "Docteur" , label:"Docteur"},
];

export const JOB_TYPES  = [
    {value: "Enseignement" , label:"Enseignement"},
    {value: "Programmeur" , label:"Programmeur"},
    {value: "Ingenieur" , label:"Ingenieur"},
    {value: "Ingenieur" , label:"Ingenieur"},
    {value: "Ingenieur" , label:"Ingenieur"},
];

export const SALARY_RANGES = [
    "Less than $1000",
    "$1000 - $15,000",
    "More than $15,000",
];