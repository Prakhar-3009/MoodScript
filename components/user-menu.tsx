"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
            avatarBox: "w-[36px] h-[36px] !w-[36px] !h-[36px]",
            userButtonAvatarBox: "w-[36px] h-[36px] !w-[36px] !h-[36px]",
            avatarImage: "w-[36px] h-[36px] rounded-full !w-[36px] !h-[36px]",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Dashboard"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/dashboard"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;