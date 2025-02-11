import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dayjs from "dayjs"


export default function RecentVaccinations({ resentVaccinations }: { resentVaccinations: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vacunaciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Vacuna</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resentVaccinations.map((vaccination:any) => (
              <TableRow key={vaccination.id}>
                <TableCell>{vaccination.pacientes.name} {vaccination.pacientes.lastname}</TableCell>
                <TableCell>{vaccination.vacunas.name}</TableCell>
                <TableCell>{dayjs(vaccination.date).format('DD/MM/YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

