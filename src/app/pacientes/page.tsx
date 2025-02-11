'use client';

import VaccineTable from "@/components/VaccineTable"

export default function PacientesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Pacientes Vacunados</h1>
      <VaccineTable />
    </div>
  )
}
