import { Button } from "./ui/button";

import Image from "next/image";

import { BASE_PATH } from "../lib/config";

interface UserProps {
  userData: any;
}

export function User(props: UserProps) {
  const { userData } = props;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-32" onClick={handleLogout}>
        Logout
      </Button>
      <div className="flex flex-col items-center gap-4">
        <Image
          width="100"
          height="100"
          src={userData.images[0].url}
          alt="User Profile"
          className="rounded-lg"
          unoptimized
        />
        <p className="text-lg font-bold">{userData.display_name}</p>
      </div>
    </div>
  );
}
