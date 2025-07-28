import React from "react";
import Navigation from "./Navigation";

const Header: React.FC = () => {
  return (
    <header>
      <div className="bg-indigo-600 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Beste Treningssenter
            </h1>
            <p className="text-indigo-100 text-sm md:text-base">
              Finn og vurder de beste treningssentrene i ditt område
            </p>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
