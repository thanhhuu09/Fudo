"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "../User/AuthDialog";
import Link from "next/link";
import Cart from "../Cart";
// import SearchDialog from "../SearchDialog";
import NavbarAvatar from "../User/NavbarAvatar";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

const Navbar = () => {
  const pathname = usePathname();
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
  const accessToken = useAuthStore().accessToken; // get latest access token
  const user = useAuthStore().user; // get latest user

  return (
    <nav className="bg-[#fff9ef] relative">
      <div className="flex justify-between items-center p-4">
        {/* Hamburger menu button */}

        <div className="flex items-center  gap-4">
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/">
            <div className="relative w-24 h-8 md:w-32 md:h-10 cursor-pointer">
              <Image
                src="/images/logo.svg"
                alt="logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Link>
        </div>
        {/* Mobile menu */}
        {accessToken && user ? (
          <div className="md:hidden flex gap-4 items-center">
            <Cart />
            <NavbarAvatar user={user} />
          </div>
        ) : (
          <div className="md:hidden flex gap-4 items-center">
            <AuthDialog />
          </div>
        )}
        {/* Desktop menu */}
        {pathname === "/" && (
          <ul className="hidden md:flex gap-4">
            {menuItems.map((item) => (
              <li
                className={`relative ${
                  item.name === currentItem ? activeStyle : "text-[#615F5A]"
                }
               transition-colors duration-300 ease-in-out
               cursor-pointer hover:text-black tracking-wider text-lg`}
                key={item.name}
                onClick={() => setCurrentItem(item.name)}
              >
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop actions */}
        <div className="hidden md:flex gap-4 items-center">
          {/* <SearchDialog onSelectProduct={} products={} /> */}

          {accessToken && user ? (
            <div className="flex items-center gap-4">
              <Cart />
              <NavbarAvatar user={user} />
            </div>
          ) : (
            <AuthDialog />
          )}
        </div>

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
                      item.name === currentItem ? activeStyle : "text-[#615F5A]"
                    } cursor-pointer hover:text-black tracking-wider text-lg`}
                    onClick={() => setCurrentItem(item.name)}
                  >
                    {item.name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
