
import { cn } from "@/lib/utils";

function Sparkle({ className, delay = "0s", duration = "2.4s" }) {
  return (
    <span
      className={cn(
        "absolute block h-3 w-3",
        "bg-gradient-to-br from-pink-400 via-fuchsia-400 to-amber-300",
        "[clip-path:polygon(50%_0%,61%_39%,100%_50%,61%_61%,50%_100%,39%_61%,0%_50%,39%_39%)]",
        "drop-shadow-[0_0_4px_rgba(255,105,180,0.7)]",
        "drop-shadow-[0_0_10px_rgba(255,193,7,0.4)]",
        "animate-[sparkle_2.4s_ease-in-out_infinite]",
        className
      )}
      style={{
        animationDelay: delay,
        animationDuration: duration,
      }}
    />
  );
}

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        "bg-gradient-to-r from-muted/40 via-muted/70 to-muted/40",
        "bg-[length:200%_100%]",
        "animate-shimmer",
        className
      )}
      {...props}
    >
      {/* Randomly positioned sparkles */}
      <div className="pointer-events-none absolute inset-0">
        <Sparkle
          className="left-[18%] top-[30%] h-2 w-2"
          delay="0s"
          duration="2.2s"
        />

        <Sparkle
          className="left-[47%] top-[62%] h-3 w-3"
          delay="0.7s"
          duration="2.8s"
        />

        <Sparkle
          className="left-[76%] top-[35%] h-2.5 w-2.5"
          delay="1.2s"
          duration="2.5s"
        />

        <Sparkle
          className="left-[32%] top-[72%] h-1.5 w-1.5"
          delay="1.7s"
          duration="2.9s"
        />

        <Sparkle
          className="left-[88%] top-[68%] h-2 w-2"
          delay="0.4s"
          duration="3.1s"
        />
      </div>

      {/* Sparkle animation */}
      <style>
        {`
          @keyframes sparkle {
            0% {
              opacity: 0;
              transform: translate3d(0, 4px, 0) scale(0.35) rotate(0deg);
              filter:
                blur(1px)
                drop-shadow(0 0 0 rgba(255, 105, 180, 0));
            }

            20% {
              opacity: 0.45;
              transform: translate3d(-2px, 1px, 0) scale(0.75) rotate(25deg);
              filter:
                blur(0.3px)
                drop-shadow(0 0 4px rgba(255, 105, 180, 0.5));
            }

            45% {
              opacity: 1;
              transform: translate3d(1px, -2px, 0) scale(1.15) rotate(55deg);
              filter:
                blur(0)
                drop-shadow(0 0 6px rgba(255, 105, 180, 0.75))
                drop-shadow(0 0 12px rgba(255, 193, 7, 0.45));
            }

            65% {
              opacity: 0.75;
              transform: translate3d(2px, -1px, 0) scale(0.95) rotate(75deg);
              filter:
                blur(0.1px)
                drop-shadow(0 0 5px rgba(255, 105, 180, 0.6));
            }

            100% {
              opacity: 0;
              transform: translate3d(0, 3px, 0) scale(0.4) rotate(110deg);
              filter:
                blur(1px)
                drop-shadow(0 0 0 rgba(255, 105, 180, 0));
            }
          }
        `}
      </style>
    </div>
  );
}

export { Skeleton };

