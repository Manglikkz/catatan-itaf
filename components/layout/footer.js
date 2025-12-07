import Link from "next/link";
import {
  BookOpen,
  Mail,
  Phone,
  Instagram,
  Heart,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "itaf.id",
      href: "https://www.instagram.com/itaf.id/",
      icon: Instagram,
    },
    {
      name: "itafschool",
      href: "https://www.instagram.com/itafschool/",
      icon: Instagram,
    },
    {
      name: "assabiqoon_",
      href: "https://www.instagram.com/assabiqoon_/",
      icon: Instagram,
    },
  ];

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Catatan", href: "/catatan" },
    { name: "Daftar", href: "/register" },
    { name: "Masuk", href: "/login" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/itaf-nobg.png"
                alt="Logo"
                width={45}
                height={24}
                className="rounded-xl"
              />
              <span className="font-bold text-lg text-gray-900 hidden sm:block">
                Catatan <span className="text-primary-500">ITAF</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platform berbagi catatan pembelajaran siswa. Belajar bersama,
              berkembang bersama untuk masa depan yang lebih cerah.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Menu</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-primary-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:StudyShare@gmail.com"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="break-all">StudyShare@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6283181438974"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  +62 831-8143-8974
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center shrink-0 group-hover:from-pink-100 group-hover:to-purple-100 transition-colors">
                      <social.icon className="w-4 h-4 text-pink-600" />
                    </div>
                    <span>@{social.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} StudyShare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
