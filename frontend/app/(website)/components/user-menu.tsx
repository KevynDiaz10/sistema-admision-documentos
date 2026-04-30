"use client"
// UserMenu principalmente contiene login/logout, sign up y UserButton.

import { Button } from "@/components/ui/button";
import React from "react";

function UserMenu() {
  return (
    <div className="flex items-center gap-2">
      <Button className="rounded-full text-white" variant={"ghost"}>Log in</Button>
      <Button className="rounded-full " variant={"secondary"}>sign up</Button>
    </div>
  );
}

export default UserMenu;
