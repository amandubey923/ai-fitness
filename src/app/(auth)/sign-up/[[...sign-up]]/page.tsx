import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-6">
      <SignUp />
    </div>
  );
};
export default SignUpPage;