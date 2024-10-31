"use client";

import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "../User/AuthDialog";
import Link from "next/link";
import Cart from "../Cart";
// import SearchDialog from "../SearchDialog";
import NavbarAvatar from "../User/NavbarAvatar";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<string>("Home");
  const menuItems = [
    {
      name: "Home",
      link: "#home",
      isActive: true,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      name: "Menu",
      link: "#popular-menu",
      isActive: false,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      name: "How it works",
      link: "#how-it-works",
      isActive: false,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      name: "About",
      link: "#about",
      isActive: false,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      name: "Contact",
      link: "#contact",
      isActive: false,
      ref: useRef<HTMLDivElement>(null),
    },
  ];
  const activeStyle =
    "text-black font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#FFAC4B] after:rounded-sm transition-all duration-300 ease-in-out";
  return (
    <nav className="bg-[#fff9ef] relative">
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width={150} height={150} />
        </Link>
        {/* Hamburger menu button */}
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-4">
          {menuItems.map((item) => (
            <li
              className={`relative ${
                item.name === currentItem ? activeStyle : "text-[#615F5A]"
              } transition-all duration-300
              cursor-pointer hover:text-black tracking-wider text-lg`}
              key={item.name}
              onClick={() => setCurrentItem(item.name)}
            >
              <a href={item.link}>{item.name}</a>
            </li>
          ))}
        </ul>
        {/* Desktop actions */}
        <div className="hidden md:flex gap-4 items-center">
          {/* <SearchDialog onSelectProduct={} products={} /> */}
          <Cart />

          <div>
            {isAuthenticated && user ? (
              <NavbarAvatar user={user} onLogout={handleLogout} />
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden z-50 absolute top-16 left-0 right-0 bg-[#fff9ef] p-6 shadow-lg rounded-b-2xl"
            >
              <ul className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    className={`${
                      item.isActive ? activeStyle : "text-[#615F5A]"
                    } cursor-pointer hover:text-black tracking-wider text-lg`}
                  >
                    {item.name}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col gap-4 items-center mt-6"
              >
                <div className="flex gap-4 w-full justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white rounded-full shadow-md"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white rounded-full shadow-md"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
                <AuthDialog />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
