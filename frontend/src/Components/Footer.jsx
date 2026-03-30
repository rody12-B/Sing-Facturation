import { Briefcase } from "lucide-react"

const Footer = () => {
  return (
    <footer className='relative bg-gray-50 text-gray-900 overflow-hidden'>
        <div className="relative z-10 px-16">
            <div className="max-w-6xl mx-auto">
                {/* contenu principal du bas de page */}
                <div className="text-center space-y-8">
                    {/* logo */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800" >Sing Web</h3>
                        </div>
                        <p className={`text-sm text-gray-600 max-w-md mx-auto`}>
                            La capacité de vous servir est notre priorité dans ce que nous faisons .
                        </p>
                    </div>
                    {/* copyright */}
                    <div className="space-y-2">
                        <p className={`text-sm text-gray-600`}>
                            © {new Date().getFullYear() } Heure de creer les factures.
                        </p>
                        <p className={`text-xs text-gray-500`}>
                            Soyez heurex dans ce que vous faites
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </footer>
  )
}

export default Footer