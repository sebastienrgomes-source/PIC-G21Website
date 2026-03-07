import { cva } from "class-variance-authority";
import { cn } from "../../../shared/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      outline: "border-border text-foreground",
      warning: "border-transparent bg-amber-500 text-white",
      destructive: "border-transparent bg-red-600 text-white",
      success: "border-transparent bg-emerald-600 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
