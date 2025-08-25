import LoadingThreeDots from '@/components/DotLoading';
import Image from 'next/image';

export default function LoadingContainer() {
  return (
    <div className="w-full h-screen gap-5 flex flex-col justify-center items-center">
      <Image
        src="/images/iscaf_icon.png"
        alt="Logo"
        width={40}
        height={40}
        priority
      />
      <LoadingThreeDots />
    </div>
  );
}
