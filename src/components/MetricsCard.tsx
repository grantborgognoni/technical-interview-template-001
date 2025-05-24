import { useEffect, useState, useRef } from "react";

type MetricsCardProps = {
  title: string;
  value: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
};

export default function MetricsCard({
  title,
  value,
  trend,
  trendDirection,
}: MetricsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    const end = value;
    const duration = 1000;

    function animate(currentTime: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * end);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    }

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      startTimeRef.current = null;
    };
  }, [value]);

  return (
    <div className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{displayValue}</p>
        <span
          className={`ml-2 text-xs font-medium ${
            trendDirection === "up"
              ? "text-green-600"
              : trendDirection === "down"
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
