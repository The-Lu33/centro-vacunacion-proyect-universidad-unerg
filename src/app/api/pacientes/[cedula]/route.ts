import prisma from "@/utils/conn";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cedula: string }> }
) {
  try {
    const cedula = (await params).cedula;
    console.log(cedula);
    const paciente = await prisma.pacientes.findFirst({
      where: { cedula: parseInt(cedula) },
      select: {
        name: true,
        lastname: true,
        cedula: true,
      },
    });
    console.log(paciente);
    if (!paciente) {
      return Response.json(
        { message: "Paciente no encontrado" },
        { status: 404 }
      );
    }
    return Response.json({ success: true, paciente }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    return Response.json(
      { success: false, message: "Error en la petición" },
      { status: 500 }
    );
  }
}
