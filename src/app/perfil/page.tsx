import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/utils/conn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const data = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  if (userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    return { user };
  }
  return { user: null };
};

export default async function PerfilPage() {
  const { user } = await data();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-start space-y-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Perfil del Médico
      </h1>
      <Card className="xl:w-[400px] ">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>
                {[user.name, user.lastname]
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.name} {user.lastname}
              </CardTitle>
              <p className="text-blue-600">Médico General</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                Información de Contacto
              </h3>
              <p>Email: {user.email}</p>
              <p>Teléfono: {user.phone}</p>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold text-blue-800">Especialidad</h3>
              <p>Medicina General</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Experiencia</h3>
              <p>10 años de práctica médica</p>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
