import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import Logo from "./Logo";

const productLinks = [
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "Demo" },
  { href: "#", label: "API" },
];

const companyLinks = [
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
  { href: "/policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const contactInfo = [
  { icon: Mail, text: "support@klassiko.com" },
  { icon: Phone, text: "+1 (555) 123-4567" },
  { icon: MapPin, text: "San Francisco, CA" },
];


export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="size-10" />
              <span className="text-xl font-semibold text-neutral-100">
                Klassiko
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm text-sm">
              Empowering educational institutions with intelligent assessment
              tools for the digital age.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs">Product</h3>
            <div className="space-y-2">
              {productLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs">Company</h3>
            <div className="space-y-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs">Contact Info</h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <info.icon className="h-4 w-4 text-neutral-400" />
                  <span className=" text-sm text-neutral-400">{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Klassiko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
