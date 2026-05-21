"use client"
// UserMenu principalmente contiene login/logout, sign up y UserButton.

import { Button } from "@/components/ui/button";
import Link from "next/link";

function UserMenu() {
  return (
    <div className="flex items-center gap-2">
      <Button className="rounded-full text-white" variant={"ghost"}><Link href='/auth/login'>Log in</Link></Button>
      <Button className="rounded-full " variant={"secondary"}><Link href='/auth/register'>sign up</Link></Button>
    </div>
  );
}

export default UserMenu;
