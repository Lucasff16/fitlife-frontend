import { createContext, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockContext = createContext<{ mouseX: number }>({ mouseX: 0 });

export function Dock({ children }: { children: React.ReactNode }) {
  const [mouseX, setMouseX] = useState(0);

  return (
    <DockContext.Provider value={{ mouseX }}>
      <motion.div
        onMouseMove={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          setMouseX(e.pageX - bounds.left);
        }}
        onMouseLeave={() => setMouseX(0)}
        className="flex h-16 items-end gap-4 rounded-2xl bg-white/10 px-4 backdrop-blur-md"
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const { mouseX } = useContext(DockContext);
  const ref = useRef<HTMLDivElement>(null);

  const distance = useMotionValue(0);
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`aspect-square w-10 cursor-pointer ${className}`}
      onUpdate={(latest) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        const distanceFromMouseX = mouseX - (bounds.x + bounds.width / 2);
        distance.set(distanceFromMouseX);
      }}
    >
      {children}
    </motion.div>
  );
}

export function DockIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full p-2">{children}</div>;
}

export function DockLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
      <div className="rounded-md bg-black/80 px-3 py-1 text-sm text-white">
        {children}
      </div>
    </div>
  );
}