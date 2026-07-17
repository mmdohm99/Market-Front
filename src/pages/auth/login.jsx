import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { mergeGuestCartOnLogin } from "@/store/shop/cart-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/shop/home";

  function onSubmit(event) {
    event.preventDefault();
  
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        const user = data.payload.user;
        const userId = user?.id;
  console.log(user)
        dispatch(mergeGuestCartOnLogin(userId)).then(() => {
          toast({ title: data?.payload?.message });
  
          if (user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }
        });
      } else {
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    });
  }

  function handleContinueAsGuest() {
    navigate('/shop/home');
  }

  return (
    <div className="rounded-2xl border border-border bg-card/95 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm animate-scale-in">
      <div className="space-y-6">
        <div
          className="animate-fade-in-up animate-delay-100 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back. Sign in to continue.
          </p>
        </div>

        <div
          className="animate-fade-in-up animate-delay-200 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <CommonForm
            formControls={loginFormControls}
            buttonText="Sign in"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonClassName="mt-2 w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
          />
        </div>

        <div
          className="animate-fade-in-up animate-delay-250 flex items-center gap-3 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="animate-fade-in-up animate-delay-250 w-full rounded-lg border border-border bg-transparent py-2.5 text-sm font-semibold text-foreground opacity-0 transition-colors hover:bg-muted"
          style={{ animationFillMode: "forwards" }}
        >
          Continue shopping
        </button>

        <p
          className="animate-fade-in-up animate-delay-300 text-center text-sm text-muted-foreground opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;