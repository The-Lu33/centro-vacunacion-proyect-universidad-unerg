import prisma from "@/utils/conn";

export async function GET() {
  try {
    const vacunas = await prisma.vacunas.findMany();
    console.log({ vacunas });
    if (!vacunas) {
      return Response.json(
        { message: "No se encontraron vacunas" },
        { status: 404 }
      );
    }
    return Response.json({ success: true, vacunas }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
}
