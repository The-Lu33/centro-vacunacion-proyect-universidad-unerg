import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10; // Adjust salt rounds for security vs. performance

  // Create Users (1 admin, 4 doctors, 5 regular users)
  const users = [
    {
      email: "admin@example.com",
      name: "Admin",
      lastname: "User",
      password: await bcrypt.hash("password123", saltRounds), // Hash password
      role: "admin",
      phone: "1234567890",
      especialidad: null, // Admin doesn't need a specialty
      address: "Admin Address",
      city: "Admin City",
      country: "Admin Country",
    },
    ...Array.from({ length: 4 }, async (_, i) => ({
      // Doctors
      email: `doctor${i + 1}@example.com`,
      name: `Doctor${i + 1}`,
      lastname: "Lastname",
      password: await bcrypt.hash("password123", saltRounds),
      role: "doctor",
      phone: `111222333${i}`,
      especialidad: [
        "Medicina General",
        "Cardiología",
        "Pediatría",
        "Dermatología",
      ][i],
      address: `Doctor Address ${i}`,
      city: `Doctor City ${i}`,
      country: "Venezuela",
    })),
    ...Array.from({ length: 5 }, async (_, i) => ({
      // Regular Users
      email: `user${i + 1}@example.com`,
      name: `User${i + 1}`,
      lastname: "Lastname",
      password: await bcrypt.hash("password123", saltRounds),
      role: "user",
      phone: `444555666${i}`,
      especialidad: null,
      address: `User Address ${i}`,
      city: `User City ${i}`,
      country: "Venezuela",
    })),
  ];

  await prisma.users.createMany({ data: users });

  // Create Vacunas (More vaccines)
  const vacunas = [
    { name: "Vacuna A" },
    { name: "Vacuna B" },
    { name: "Vacuna C" },
    { name: "Influenza" },
    { name: "Sarampión" },
    { name: "Rubeola" },
    { name: "Parotiditis" },
    { name: "Varicela" },
    { name: "Hepatitis A" },
    { name: "Hepatitis B" },
    { name: "Neumococo" },
    { name: "Meningitis" },
    { name: "Fiebre Amarilla" },
    { name: "Difteria" },
    { name: "Tétanos" },
    { name: "Tosferina" },
    { name: "Poliomielitis" },
    { name: "COVID-19 - Pfizer" },
    { name: "COVID-19 - Moderna" },
    { name: "COVID-19 - AstraZeneca" },
  ];
  await prisma.vacunas.createMany({ data: vacunas });

  // Create Pacientes (20 patients)
  const pacientes = Array.from({ length: 20 }, (_, i) => ({
    name: `Paciente${i + 1}`,
    lastname: "Lastname",
    cedula: 1000000 + i,
    email: `paciente${i + 1}@example.com`,
    phone: `777888999${i}`,
    address: `Paciente Address ${i}`,
    city: `Paciente City ${i}`,
    date_of_birth: new Date(`2000-01-${(i % 28) + 1}`), // Vary birth dates
    country: "Venezuela",
  }));
  await prisma.pacientes.createMany({ data: pacientes });

  // Create Registro (Vaccine records - one per patient, random vaccine)
  const registro = pacientes.map((paciente, i) => ({
    date: new Date(`2024-01-${(i % 28) + 1}`), // Vary dates
    dosis: ["primera", "segunda", "tercera"][i % 3], // Vary doses
    vacunaId: Math.floor(Math.random() * vacunas.length) + 1, // Random vaccine
    pacienteId: paciente.id, // Use the actual patient ID after creation
  }));

  // The following code is updated to use the actual patient IDs
  const createdPacientes = await prisma.pacientes.findMany(); // Fetch created patients

  const registroWithIds = createdPacientes.map((paciente, i) => ({
    date: new Date(`2024-01-${(i % 28) + 1}`),
    dosis: ["primera", "segunda", "tercera"][i % 3],
    vacunaId: Math.floor(Math.random() * vacunas.length) + 1,
    pacienteId: paciente.id,
  }));

  await prisma.registro.createMany({ data: registroWithIds });
}

main()
  .then(() => {
    console.log("Data seeded.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
