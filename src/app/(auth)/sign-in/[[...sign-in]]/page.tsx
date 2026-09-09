import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-6">
      <SignIn />
    </div>
  );
};
export default SignInPage;