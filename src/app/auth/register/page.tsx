"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {  useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    lastname: "",
    role: "DOCTOR",
    phone: "",
    especialidad: "",
    address: "",
    city: "",
    country: ""
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Registro Exitoso",
          description: "Usuario creado correctamente",
          variant: "success"
        });
        router.push("/auth/login");
      } else {
        toast({
          title: "Error de Registro",
          description: result.message || "No se pudo crear el usuario",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de Registro",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Registro</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Apellido"
            required
            className="w-full p-2 mb-4 border rounded"
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            placeholder="Especialidad"
            className="w-full p-2 mb-4 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="País"
            className="w-full p-2 mb-4 border rounded"
          />
        </div>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full p-2 mb-4 border rounded"
        />

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}