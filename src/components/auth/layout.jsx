import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel: gradient, pattern, floating shapes */}
      <div className="hidden lg:flex relative w-1/2 min-h-screen overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-foreground/10 animate-float" />
        <div className="absolute bottom-32 right-24 w-24 h-24 rounded-full bg-primary-foreground/10 animate-float [animation-delay:1s]" />
        <div className="absolute top-1/3 right-20 w-16 h-16 rounded-lg bg-primary-foreground/10 animate-float [animation-delay:2s] rotate-12" />
        <div className="absolute bottom-48 left-32 w-20 h-20 rounded-full bg-primary-foreground/10 animate-float [animation-delay:0.5s]" />
        <div className="relative z-10 flex items-center justify-center w-full px-12">
          <div className="max-w-md space-y-8 text-center text-primary-foreground animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Handcrafted with care
            </h1>
            <p className="text-lg opacity-90 font-body">
              Discover unique pieces made by artisans. Shop the collection and support small makers.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        <div className="relative w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
