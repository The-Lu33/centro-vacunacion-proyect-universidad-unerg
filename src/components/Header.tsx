import {  User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DropdownMenuItems from "@/components/DropdownMenuItems"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 min-h-116">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}
          </div>
          {session?.user.id ? (
          <div className="flex items-center">
            {/* <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItems />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          ): (
            <div className="flex items-center">
              <Button  className="mr-2 bg-blue-600 hover:bg-blue-700">
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

