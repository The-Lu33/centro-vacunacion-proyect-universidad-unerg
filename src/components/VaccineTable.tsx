"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface VaccineRecord {
  id: string;
  pacientes: {
    cedula: string;
    name: string;
    lastname: string;
  };
  vacunas: {
    name: string;
  };
  date: string;
  dosis: string;
}
export default function VaccineTable() {
  const { toast } = useToast();
  const [records, setRecords] = useState<VaccineRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/registro");
        const fetchedRecords = await res.json();
        setRecords(fetchedRecords);
      } catch (error) {
        console.error("Error fetching records", error);
        toast({
          title: "Error",
          description: "Hubo un problema al cargar los registros.",
          variant: "destructive",
        });
      }
    };
    if (records.length === 0) fetchRecords();
  }, []);
  console.log(records);
  const filteredRecords = records.filter(
    (record) =>
      Number(record.pacientes?.cedula) === Number(searchTerm) ||
      (record.pacientes?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.pacientes?.lastname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.vacunas?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros de Vacunación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Mostrando {indexOfFirstRecord + 1} -{" "}
            {Math.min(indexOfLastRecord, records.length)} de{" "}
            {records.length} registros
          </div>
        </div>
         <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Cedula</TableHead>
              <TableHead className="w-[250px]">Nombre del Paciente</TableHead>
              <TableHead>Vacuna</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Dosis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.pacientes.cedula}</TableCell>
                <TableCell>{`${record.pacientes.name} ${record.pacientes.lastname}`}</TableCell>
                <TableCell>{record.vacunas.name}</TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>{record.dosis}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {currentPage} de{" "}
            {Math.ceil(records.length / recordsPerPage)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastRecord >= records.length}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
          </div>
      </CardContent>
    </Card>
  );
}
