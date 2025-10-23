"use client";

import { EditProfileDialog } from "@/app/(main)/users/[username]/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";

type EditProfileButtonProps = {
  user: UserData;
};

export function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  return (
    <>
      <Button
        variant={"outline"}
        className="text-primary border-primary outline-primary hover:text-primary"
        onClick={() => setShowDialog(true)}
      >
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
