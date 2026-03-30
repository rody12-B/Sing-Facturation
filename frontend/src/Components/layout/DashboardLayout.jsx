import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Building2, LogOut, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { NAVIGATION_MENU } from "../../utils/data";
import logo from '../../assets/img/logo.jpg';
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import DateTimeDisplay from "./Date";



const NavigationItem = ({ item, onClick, isCollapsed, expandedItems, toggleExpand, activeNavItem }) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    const handleClick = (child) => {
        if (child.path && !child.children) {
            const fullPath = child.path.startsWith("/") ? child.path : `${item.path}/${child.path}`;
            onClick(fullPath, child.id);
        } else if (hasChildren) {
            toggleExpand(item.id);
        }
    };

    return (
        <div>
            <button
                onClick={() => handleClick(item)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${activeNavItem === item.id || item.children?.some(c => c.id === activeNavItem) ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
                <Icon className={`h-5 w-5 flex-shrink-0 ${activeNavItem === item.id ? "text-blue-600" : "text-gray-500"}`} />
                {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
                {hasChildren && !isCollapsed && (
                    <span className="ml-auto">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </span>
                )}
            </button>
            {hasChildren && !isCollapsed && (
                <div className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                    {item.children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => handleClick(child)}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${activeNavItem === child.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <child.icon className="h-4 w-4 mr-2" />
                            {child.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Composant DashboardLayout
const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedItems, setExpandedItems] = useState([]);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    

    // Toggle Expand avec sauvegarde dans localStorage
    const toggleExpand = (id) => {
        setExpandedItems(prev => {
            const newState = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            localStorage.setItem("expandedItems", JSON.stringify(newState));
            return newState;
        });
    };

    // Restaurer les sous-menus ouverts
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("expandedItems")) || [];
        setExpandedItems(saved);
    }, []);

    // Détecter l'élément actif
    useEffect(() => {
        const findActiveItem = (menu) => {
            for (let item of menu) {
                if (item.path === location.pathname) return item.id;
                if (item.children) {
                    const child = item.children.find(c => location.pathname.endsWith(c.path));
                    if (child) {
                        
                        return child.id;
                    }
                }
            }
            return "";
        };
        setActiveNavItem(findActiveItem(NAVIGATION_MENU));
    }, [location.pathname]);

    const handleNavigation = (path, id) => {
        setActiveNavItem(id);
        navigate(path);
        if (isMobile) setSidebarOpen(false);
    };

    const getActivePageName = () => {
        const findName = (menu) => {
            for (let item of menu) {
                if (item.id === activeNavItem) return item.name;
                if (item.children) {
                    const child = item.children.find(c => c.id === activeNavItem);
                    if (child) return child.name;
                }
            }
            return "Bienvenue dans votre espace de gestion"; 
        };
        return findName(NAVIGATION_MENU);
    };

    // Responsive
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
      
      
    return (
        <div className='flex h-screen bg-gray-50'>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} ${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200`}>
                {/* Logo */}
                <div className='flex items-center h-16 border-b border-gray-200 pl-6'>
                    {!sidebarOpen ? (
                        <button onClick={toggleSidebar} className='p-2 rounded-md hover:bg-gray-200'>
                            <Menu className='h-5 w-5 text-gray-600' />
                        </button>
                    ) : (
                        <Link to="/menu-dash" className="flex items-center space-x-3 group">
                            <img src={logo} alt="logo" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105" />
                            <span className="text-gray-900 font-bold text-xl tracking-wide group-hover:text-indigo-600">OD-Partners</span>
                        </Link>
                    )}
                </div>

                {/* Ajout du nouveau bouton de fermeture */}
                {sidebarOpen && (
                    <button onClick={toggleSidebar} className='absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200'>
                        <X className='h-5 w-5 text-gray-600' />
                    </button>
                )}

                {/* Navigation */}
                <nav className="p-4 space-y-2 ">
                    {NAVIGATION_MENU.map(item => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            onClick={handleNavigation}
                            isCollapsed={!sidebarOpen}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                            activeNavItem={activeNavItem}
                            
                        />
                    ))}
                </nav>

                {/* Déconnexion */}
                <div className='absolute bottom-4 left-4 right-4'>
                    <button
                        className='w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200'
                        onClick={logout}
                    >
                        <LogOut className='h-5 w-5 flex-shrink-0 text-gray-500' />
                        {sidebarOpen && <span className='ml-3'>Déconnexion</span>}
                    </button>
                </div>
            </div>

            {/* Contenu principal */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-16"}`}>
                {/* Header */}
                <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30'>
                    <div className='flex items-center space-x-4'>
                        {isMobile && (
                            <button onClick={toggleSidebar} className='p-2 rounded-md hover:bg-gray-200'>
                                {sidebarOpen ? <X className='h-5 w-5 text-gray-600' /> : <Menu className='h-5 w-5 text-gray-600' />}
                            </button>
                        )}
                        <div>
                        <h1 className="text-xl md:text-1xl font-bold text-gray-900 tracking-wide">
                             {getActivePageName()}
                        </h1>

                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <DateTimeDisplay />
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); }}
                            avatar={user?.personnelInfo?.avatar || ""}
                            companyName={user?.personnelInfo?.raisonSocial || ""}
                            onLogout={logout}
                        />
                    </div>
                </header>
                {/* Contenu pages */}
                <main className='flex-1 p-4 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
