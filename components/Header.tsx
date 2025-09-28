import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Smooth Operator
        </h1>
        <p className="mt-2 text-lg text-stone-500">
          Easing you into easing.
        </p>
      </div>
    </header>
  );
};

export default Header;