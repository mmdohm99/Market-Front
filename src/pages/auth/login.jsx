import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      console.log("Login response:", data);
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
      } else {
        toast({ title: data?.message, variant: "destructive" });
      }
    });
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
