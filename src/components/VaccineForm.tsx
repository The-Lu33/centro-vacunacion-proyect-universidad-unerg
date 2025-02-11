"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarIcon } from "lucide-react";
import { addVaccineRecord } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { Spinner } from "./ui/spinner";
import { useSpinner } from "./ui/spinner-provider";
interface Vacuna {
  id: number;
  name: string;
}
export default function VaccineForm() {
  const { show, hide } = useSpinner();
  const [formData, setFormData] = useState({
    patientName: "",
    cedula: "",
    vaccineName: "",
    date: new Date(),
    dosis: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacunas, setVacunas] = useState<Vacuna[] | []>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVacunas = async () => {
      try {
        const res = await fetch("/api/vacunas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        setVacunas(result.vacunas);
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al cargar las vacunas.",
          variant: "destructive",
        });
        console.log(error);
      }
    };

    fetchVacunas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, dosis: value });
  };

  const handleVaccineChange = (value: string) => {
    setFormData({ ...formData, vaccineName: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addVaccineRecord(formData);
      const res = await fetch("/api/registro", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }

      toast({
        title: result.success ? "Éxito" : "Error",
        description: result.message,
        variant: "default",
      });
      setFormData({
        patientName: "",
        cedula: "",
        vaccineName: "",
        date: new Date(),
        dosis: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un problema al registrar la vacuna. Por favor, intente nuevamente.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // buscar cedula mientras se tipea
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cedula = e.target.value;
    if (cedula.length < 5) return;
    try {
      show();
      const res = await fetch(`/api/pacientes/${cedula}`);
      const result = await res.json();
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }
      setFormData({
        ...formData,
        patientName: result.paciente.name + " " + result.paciente.lastname,
        cedula: result.paciente.cedula,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      hide();
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nueva Vacunación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  onBlur={handleSearch}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Nombre del Paciente</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vaccineName">Nombre de la Vacuna</Label>
              <Select
                name="vaccineName"
                value={formData.vaccineName}
                onValueChange={handleVaccineChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la vacuna" />
                </SelectTrigger>
                <SelectContent>
                  {vacunas?.map((vacuna) => (
                    <SelectItem key={vacuna.id} value={vacuna.name}>
                      {vacuna.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de Vacunación</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full">
                      <Button
                        type="button"
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {formData.date ? (
                          dayjs(formData.date).format("DD/MM/YYYY")
                        ) : (
                          <span>Seleccionar Fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosis">Dosis</Label>
                <Select
                  name="dosis"
                  value={formData.dosis}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la dosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primera">Primera dosis</SelectItem>
                    <SelectItem value="segunda">Segunda dosis</SelectItem>
                    <SelectItem value="tercera">Tercera dosis</SelectItem>
                    <SelectItem value="refuerzo">Refuerzo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 transition-colors font-bold text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Vacuna"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}
