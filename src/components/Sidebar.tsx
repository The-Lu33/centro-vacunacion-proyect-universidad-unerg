import Link from "next/link"
import { Home, Syringe, Users, User, UserRoundPlus, Settings } from "lucide-react"
import { getServerSession } from "next-auth";
import {options} from '@/app/options';
const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Syringe, label: "Registrar Vacuna", href: "/registro" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: UserRoundPlus, label: "Nuevo Paciente", href: "/pacientes/register" },
  // { icon: BarChart, label: "Estadísticas", href: "/estadisticas" },
  { icon: User, label: "Perfil", href: "/perfil" },
  // { icon: Settings, label: "Configuración", href: "/configuracion" },
]

export default async function Sidebar() {
  const session = await getServerSession(options);

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">VacunaTrack</h1>
      </div>
      {session?.user.email && (
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      )}
   </div>
  )
}

