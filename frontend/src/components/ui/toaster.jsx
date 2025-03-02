// Ensure the Toaster component handles toast objects properly
// You may need to adjust this based on your actual implementation
import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner 
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: "group toast",
          description: "group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
}

export { Toaster };