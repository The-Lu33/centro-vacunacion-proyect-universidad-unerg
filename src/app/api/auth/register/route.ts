import prisma from "@/utils/conn";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      email,
      password,
      name,
      lastname,
      role = "DOCTOR",
      phone = "0101010203",
      especialidad = "",
      address = "",
      city = "",
      country = "",
    } = data;
    const userExist = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      return Response.json({
        success: false,
        message: "Usuario ya existe",
      });
    }
    const hashedPassword = await hash(password, 10);
   await prisma.users.create({
      data: {
        email,
        name,
        lastname,
        role,
        phone,
        especialidad,
        address,
        city,
        country,
        password: hashedPassword,
      },
    });
    return Response.json(
      { success: true, message: "Usuario creado" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json({
        success: false,
        message: error.message,
      });
    }
  }
}
