"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useSpinner } from "./ui/spinner-provider";

export default function DropdownMenuItems() {
  const { show, hide } = useSpinner();
  // cerrar session

  return (
    <>
      <DropdownMenuItem asChild>
        <a href="/perfil">Perfil</a>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => {
        show();
        signOut();
      }}>
        Cerrar sesión
      </DropdownMenuItem>
    </>
  );
}
