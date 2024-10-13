import Image from 'next/image';

interface BoxItemProps {
  imageUrl: string;
  altText: string;
}

const BoxItem: React.FC<BoxItemProps> = ({ imageUrl, altText }) => {
  return (
    <div className="w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center">
      <Image
        src={imageUrl}
        alt={altText}
        width={80} 
        height={80} 
      />
    </div>
  );
};

export default BoxItem;