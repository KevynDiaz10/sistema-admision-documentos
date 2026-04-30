"use client"

import MenuNavigation from "./navegation-menu"
import Logotipo from "../logotipo-component"
import UserMenu from "../user-menu"
function Header() {
  return (
    <header className='h-16 bg-sky-950 flex justify-between px-4 py-2 sticky top-0 z-50'>{/* z-50: z-50 so that the header is in front of the FeatureItems*/}
      
      <Logotipo/>
      <MenuNavigation />
      <UserMenu/>
    </header>
  )
}

export default Header