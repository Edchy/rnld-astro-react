import { createSwapy } from 'swapy';
import { useEffect, useRef } from 'react';
import { GripIcon, HandMetal } from 'lucide-react';
import styles from '../styles/Swapy.module.css';

export default function Swapy() {
  const swapy = useRef<ReturnType<typeof createSwapy> | null>(null);
  const container = useRef(null);

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        animation: 'spring',
      });

      // Your event listeners
      swapy.current.onSwap((event) => {
        console.log('swap', event);
      });
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);

  return (
    <div className="grid grid-cols-3 grid-rows-3 grid-flow-dense" ref={container}>
      <div className="" data-swapy-slot="a">
        <div className=" p-10" data-swapy-item="a">
          <GripIcon size={50} data-swapy-handle />

          <div>A</div>
        </div>
      </div>

      <div data-swapy-slot="b">
        <div className="bg-blue-600 p-10 x" data-swapy-item="b">
          <GripIcon size={50} data-swapy-handle />

          <div>B</div>
        </div>
      </div>
      <div data-swapy-slot="c">
        <div className="bg-green-600 p-10" data-swapy-item="c">
          <GripIcon size={50} data-swapy-handle />

          <div>C</div>
        </div>
      </div>
      <div data-swapy-slot="d">
        <div className="bg-pink-600 p-10" data-swapy-item="d">
          <GripIcon size={50} data-swapy-handle />
          {/* <HandMetal size={5} /> */}
          <div>D</div>
        </div>
      </div>
    </div>
  );
}
