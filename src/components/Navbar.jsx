import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Titre */}
          <div className="flex items-center">
            <img
              className="h-8 w-8 mr-2"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
            />
            <span className="font-bold text-lg">Graphe MPM</span>
          </div>

          {/* Liens */}
          <div className="flex space-x-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Exemple
            </NavLink>

            <NavLink
              to="/mes-taches"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Mes Tâches
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
