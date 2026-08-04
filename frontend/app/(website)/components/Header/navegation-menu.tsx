import {
  NavigationMenuItem,
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

function MenuNavigation() {
  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Dirección</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md "
                      href="/"
                    >
                      <div className="mb-2 text-sm font-medium">
                        El Instituto Universitario de Tecnología de Administración Industrial (IUTA) Ampliación Altos Mirandinos
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Ubicación">
                  Carretera Panamericana, kilómetro 25, sector El Cabotaje
                </ListItem>
                <ListItem href="/docs/installation" title="Horarios">
                  Lunes a Viernes: 8:00 am - 6:00 pm | Sábados: 9:00 am - 1:00 pm
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            <NavigationMenuTrigger>contactanos</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="#">
                      <div className="font-medium">Correo electrónico</div>
                      <div className="text-muted-foreground">
                        altosmirandinos@iuta.edu.ve
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">
                      <div className="font-medium">Telefonos</div>
                      <div className="text-muted-foreground">
                        (0212) 323-59-66 / (0212) 323-60-94
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="https://www.instagram.com/iutaltos_oficial/">
                      <div className="font-medium">Instagram</div>
                      <div className="text-muted-foreground">
                        @iutaltos_oficial
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
export default MenuNavigation;
