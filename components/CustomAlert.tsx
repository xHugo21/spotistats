import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface CustomAlertProps {
  title: string;
  description: string;
}

export function CustomAlert(props: CustomAlertProps) {
  const { title, description } = props;

  useEffect(() => {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });

  return (
    <Alert variant="destructive">
      <AlertTitle>Error {title}</AlertTitle>
      <AlertDescription>{description}. Reloading in 3 seconds</AlertDescription>
    </Alert>
  );
}
