import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "./ui/button";

interface UserProps {
  userData: any;
}

export function User(props: UserProps) {
  const { userData } = props;

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-32" onClick={handleLogout}>
        Logout
      </Button>
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Image
          width="100"
          height="100"
          src={userData.images[0].url}
          alt="User Profile"
          className="rounded-lg"
          unoptimized
        />
        <p className="text-lg font-bold">{userData.display_name}</p>
      </motion.div>
    </div>
  );
}
