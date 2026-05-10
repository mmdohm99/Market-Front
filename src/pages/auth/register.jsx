import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        navigate("/auth/login");
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card/95 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm animate-scale-in">
      <div className="space-y-6">
        <div className="animate-fade-in-up animate-delay-100 opacity-0" style={{ animationFillMode: "forwards" }}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Create account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join us. Create an account to start shopping.
          </p>
        </div>

        <div className="animate-fade-in-up animate-delay-200 opacity-0" style={{ animationFillMode: "forwards" }}>
          <CommonForm
            formControls={registerFormControls}
            buttonText="Sign up"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonClassName="mt-2 w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
          />
        </div>

        <p className="animate-fade-in-up animate-delay-300 text-center text-sm text-muted-foreground opacity-0" style={{ animationFillMode: "forwards" }}>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthRegister;
