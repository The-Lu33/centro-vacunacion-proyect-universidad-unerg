"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSpinner } from "@/components/ui/spinner-provider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PacienteForm() {
  const { show, hide } = useSpinner();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    cedula: "",
    email: "",
    phone: "",
    date_of_birth: undefined as Date | undefined,
    address: "",
    city: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.lastname || !formData.cedula) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      show();
      const response = await fetch("/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          cedula: parseInt(formData.cedula),
          date_of_birth: formData.date_of_birth?.toISOString()
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Paciente creado correctamente",
          variant: "success"
        });
        
        // Reset form
        setFormData({
          name: "",
          lastname: "",
          cedula: "",
          email: "",
          phone: "",
          date_of_birth: undefined,
          address: "",
          city: "",
          country: ""
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo crear el paciente",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      hide();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <Input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Apellido"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cédula</label>
            <Input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Número de identificación"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Número de teléfono"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.date_of_birth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_of_birth ? (
                    format(formData.date_of_birth, "PPP")
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date_of_birth}
                  onSelect={(date) => setFormData(prev => ({...prev, date_of_birth: date}))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección completa"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ciudad"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">País</label>
            <Input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="País"
              className="mt-1"
            />
          </div>
          
          <div className="col-span-2 mt-4">
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Registrar Paciente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}