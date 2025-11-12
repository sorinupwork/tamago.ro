import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "outline" | "muted";
    withCard?: boolean;
  }
>(({ className, variant = "default", withCard = false, ...props }, ref) => {
  const variantClasses = {
    default: "",
    outline: "border border-dashed",
    muted: "from-muted/50 to-background h-full bg-gradient-to-b from-30%",
  };

  const emptyContent = (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );

  if (withCard) {
    return (
      <Card className="flex-1 flex flex-col min-h-[200px] transition-all duration-300 hover:shadow-lg">
        <CardContent className="flex-1 flex items-center justify-center">
          {emptyContent}
        </CardContent>
      </Card>
    );
  }

  return emptyContent;
});
Empty.displayName = "Empty";

const EmptyHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-2 text-center", className)}
    {...props}
  />
));
EmptyHeader.displayName = "EmptyHeader";

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "icon";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground",
      variant === "icon" && "size-12",
      className
    )}
    {...props}
  />
));
EmptyMedia.displayName = "EmptyMedia";

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
EmptyTitle.displayName = "EmptyTitle";

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
EmptyDescription.displayName = "EmptyDescription";

const EmptyContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-4", className)}
    {...props}
  />
));
EmptyContent.displayName = "EmptyContent";

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
};
