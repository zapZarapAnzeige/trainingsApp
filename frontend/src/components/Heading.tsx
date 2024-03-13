import React from "react";

interface HeadingProps {
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
  return <h1 className="my-4 text-2xl font-bold text-gray-700">{title}</h1>;
};

export default Heading;
