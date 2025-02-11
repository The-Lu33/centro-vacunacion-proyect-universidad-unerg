import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Syringe, Users, Stethoscope, TrendingUp } from "lucide-react";
import VaccinationChart from "@/components/VaccinationChart";
import RecentVaccinations from "@/components/RecentVaccinations";
import prisma from "@/utils/conn";
import dayjs from "dayjs";

export default async function Home() {
  const resentVaccinations = await prisma.registro.findMany({
    take: 5,
    orderBy: {
      date: "desc",
    },
    include:{
      vacunas:true,
      pacientes:true
    }
  });
  const totalVacunas = await prisma.vacunas.count();
  const totalPacientes = await prisma.pacientes.count();
  const totalDoctores = await prisma.users.count({
    where: {
      role: { in: ["doctor", "Medicina General"] },
    },
  });

  const tasaVacunacion = (totalVacunas / totalPacientes) * 100;
  const registro = await prisma.registro.findMany();
  // agruar por mes 
  //  {mes: enero, cantidad: 0}
  const monthAbbreviations: { [key: string]: string } = {
    'January': 'Ene',
    'February': 'Feb',
    'March': 'Mar',
    'April': 'Abr',
    'May': 'May',
    'June': 'Jun',
    'July': 'Jul',
    'August': 'Ago',
    'September': 'Sep',
    'October': 'Oct',
    'November': 'Nov',
    'December': 'Dic'
  };

  const registroGroupByDate = registro.filter((registro) => registro.date)
    .reduce((acc, cur) => {
      const month = dayjs(cur.date).format("MMMM");
      const year = dayjs(cur.date).format("YYYY");
      const key = `${month} ${year}`;
      
      if (!acc.find(item => item.mes === key)) {
        acc.push({ mes: key, cantidad: 0 });
      }
      
      const monthIndex = acc.findIndex(item => item.mes === key);
      acc[monthIndex].cantidad++;
      
      return acc;
    }, [] as { mes: string, cantidad: number }[])
    .sort((a, b) => 
      dayjs(a.mes, "MMMM YYYY").isBefore(dayjs(b.mes, "MMMM YYYY")) ? -1 : 1
    )
    .map(item => ({
      name: monthAbbreviations[item.mes.split(' ')[0]] || item.mes.substring(0, 3),
      vacunas: item.cantidad
    }));
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Panel de Control
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vacunas
            </CardTitle>
            <Syringe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalVacunas}</div>
            {/* <p className="text-xs text-gray-500">+12% desde el último mes</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Vacunados
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalPacientes}</div>
            {/* <p className="text-xs text-gray-500">+5% desde la última semana</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Médicos Activos
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalDoctores}</div>
            {/* <p className="text-xs text-gray-500">2 nuevos este mes</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Vacunación
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{tasaVacunacion}%</div>
            {/* <p className="text-xs text-gray-500">
              +2.5% desde el último trimestre
            </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VaccinationChart dataChart={registroGroupByDate} />
        <RecentVaccinations resentVaccinations={resentVaccinations} />
      </div>
    </div>
  );
}
