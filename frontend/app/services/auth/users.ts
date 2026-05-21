import z from "zod";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(2),
});

export class AuthService {
  async register(request: Request) {
    try {
      const data = await request.json();
      const validated = registerSchema.parse(data);

      const userFound = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
      });
      if (userFound) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 },
        );
      }

      const emailFound = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
      });

      const hashedPassword = await bcrypt.hash(validated.password, 10);
      const newUser = await prisma.user.create({
        data: {
          username: validated.username,
          email: validated.email,
          password: hashedPassword,
        },
      });
      const { ...user } = newUser;
      return user;
    } catch (error) {
      console.log(error, "error");
    }
  }
  async login(request: Request) {
    try {
      const data: { email: string; password: string } = await request.json();
      const { email, password } = data;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 400 },
        );
      }
    } catch (error) {
      console.log(error, "error");
    }
  }
}
