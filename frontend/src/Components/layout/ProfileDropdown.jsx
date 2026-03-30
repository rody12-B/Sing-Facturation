import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = ({
    isOpen,
    onToggle,
    companyName,
    avatar,
    onLogout,
}) => {
    const navigate= useNavigate();

  return <div className="relative">
    <button 
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
    >
        {avatar ? (
            <img 
            src={avatar }
            alt="Avatar"
            className="h-9 w-9 object-cover rounded-xl"
            />
            
        ): (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ">
                <span className="text-white font-semibold text-sm">
                    {companyName.charAt(0).toUpperCase()}
                </span>
            </div>
            
        )}
        <div className="hidden sm:block text-left" >
           <p className="text-sm font-medium text-gray-900">{companyName}</p> 
        </div>
        
        <ChevronDown className="h-4 w-4 text-gray-400" />
  </button>

  {isOpen && (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <a 
                onClick={() => navigate('/menu-dash') }
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profil
                </a>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <a 
                    href="#"
                    onClick={onLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ">
                        Déconnexion
                    </a> 
                </div>
            </div>
  )}
  </div>
};

export default ProfileDropdown
