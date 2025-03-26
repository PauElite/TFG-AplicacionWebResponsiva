"use cliente";
import dynamic from 'next/dynamic';
import burgerLoading from '@/public/animations/burgerLoading.json';

const Lottie = dynamic(
    () => import('lottie-react'),
    { ssr: false }
  );

export const BurgerLoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center">
      <Lottie 
        animationData={burgerLoading} 
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};