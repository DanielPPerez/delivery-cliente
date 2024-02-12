"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Image from "next/image";
import { useAuth } from "@/context/datacontext.js";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [forceRender, setForceRender] = useState(0);

  // Renderizar el componente cada 5 minutos (300,000 milisegundos)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
  }, []);

  return (
    <nav className="h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Inicio</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/Contacto">Contactanos</Link>
      </div>
      {/* LOGO */}
      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">Massimo</Link>
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className="md:absolute top-3 r-2 lg:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>123 456 78</span>
        </div>
        {isAuthenticated ? (
          <>
            <span className="text-white bg-red-500 px-3 py-1 rounded-md">{user.email}</span>
            <button onClick={() => logout()} className="bg-red-500 text-white px-3 py-1 rounded-md">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
        <CartIcon />
      </div>
    </nav>
  );
};

export default Navbar;
