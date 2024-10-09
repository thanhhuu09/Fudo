import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#FFF8E8] text-gray-700 py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="relative w-[150px] h-[50px]">
              <Image
                src="/images/logo.svg"
                alt="logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-sm">
              Jalan Semangka Raya, Telaga
              <br />
              Murni,Cikarang Barat, Kab. Bekasi
            </p>
            <div className="flex space-x-4 items-center">
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-700 hover:text-gray-900"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="bg-yellow-400 rounded-full p-1 text-white hover:bg-yellow-500"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-700 hover:text-gray-900"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How It Work
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-2">
              <li>+62 896 7311 2766</li>
              <li>food@example.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm">
            &copy; 2022 Let&apos;sFood. ALL RIGHT RESERVED.
          </p>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-50"></div>
      <div className="absolute bottom-4 right-1/4 w-16 h-16 bg-yellow-400 rounded-full opacity-50"></div>
    </footer>
  );
};

export default Footer;
