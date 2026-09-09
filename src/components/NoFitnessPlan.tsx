import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

const NoFitnessplan = () => {
  return (
    <div className="text-center py-12 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-primary font-mono text-lg font-bold">0</span>
      </div>

      <h2 className="text-2xl font-bold mb-3 font-mono">
        <span className="text-primary">No</span> fitness plans yet
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Start by creating a personalized fitness and diet plan tailored to your specific goals and needs
      </p>
      <Button
        size="lg"
        asChild
        className="h-11 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-md shadow-primary/20"
      >
        <Link href="/generate-program">
          <span className="relative flex items-center font-mono">
            Create Your First Plan
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </span>
        </Link>
      </Button>
    </div>
  );
};

export default NoFitnessplan;
