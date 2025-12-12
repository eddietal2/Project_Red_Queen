'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [offsetY, setOffsetY] = useState(0);
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    const handleResize = () => setHeight(`${document.body.scrollHeight}px`);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial height

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        height: '900px',
        backgroundImage: 'url(/images/umbrella_image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: `translateY(${offsetY * 0.5}px)`,
      }}
    />
  );
}