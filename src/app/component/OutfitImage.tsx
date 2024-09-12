import React from 'react';
import Image from 'next/image';

interface OutfitComponentProps {
  src: string;
}

const OutfitComponent: React.FC<OutfitComponentProps> = ({ src }) => {
  return (
    <Image
      src={src}
      alt="none"
      sizes='10vw'
      width={60}
      height={60}
      priority
    />
  );
};

export default OutfitComponent;
