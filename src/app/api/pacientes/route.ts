import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/conn";
import { getServerSession } from "next-auth";
import {options} from '@/app/options';

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "No autorizado",
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate required fields
    const {
      name,
      lastname,
      cedula,
      email,
      phone,
      date_of_birth,
      address,
      city,
      country,
    } = body;

    // Check if patient with same cedula or email already exists
    const existingPatient = await prisma.pacientes.findFirst({
      where: {
        OR: [{ cedula: cedula }, { email: email }],
      },
    });

    if (existingPatient) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe un paciente con esta cédula o correo electrónico",
        },
        { status: 400 }
      );
    }

    // Create patient
    const newPatient = await prisma.pacientes.create({
      data: {
        name,
        lastname,
        cedula,
        email,
        phone,
        date_of_birth: new Date(date_of_birth),
        address,
        city,
        country,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Paciente creado exitosamente",
        patient: newPatient,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patient:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error al crear el paciente",
      },
      { status: 500 }
    );
  }
}
