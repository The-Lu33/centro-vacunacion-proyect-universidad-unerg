import prisma from "@/utils/conn";

export async function GET() {
  try {
    const data = await prisma.registro.findMany({
      include: {
        vacunas: true,
        pacientes: true,
      },
    });
    console.log(data)
    return Response.json(data);
  } catch (error) {
    if(error instanceof Error) {
      console.error(error.message);
      return Response.json({
        success: false,
        message: error.message,
      });
    }
    return Response.json(
      { success: false, message: "Error en la petición" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data);
    // verificar si hay un usuario con ese id  o cedula
    const paciente = await prisma.pacientes.findFirst({
      where: {
        cedula: data.cedula,
      },
    });
    if (!paciente) {
      return Response.json(
        { message: "Paciente no encontrado" },
        { status: 404 }
      );
    }
    // verificar si hay una vacuna con ese id
    const vacuna = await prisma.vacunas.findFirst({
      where: {
        name: data.vacuna,
      },
    });
    if (!vacuna) {
      return Response.json(
        { message: "Vacuna no encontrada" },
        { status: 404 }
      );
    }
    const save = await prisma.registro.create({
      data: {
        date: data.date,
        dosis: data.dosis,
        vacunaId: vacuna.id,
        pacienteId: paciente.id,
      },
    });
    console.log(save);
    return Response.json({
      success: true,
      message: "Registro creado",
    });
  } catch (error) {
    if(error instanceof Error) {
      console.error(error.message);
      return Response.json({
        success: false,
        message: error.message,
      });
    }
    return Response.json(
      { success: false, message: "Error en la petición" },
      { status: 500 }
    );
  }
}
