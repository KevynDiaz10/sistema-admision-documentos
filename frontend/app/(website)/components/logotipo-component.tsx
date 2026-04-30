import Link from "next/link";
import "../../../public/iuta-logo-png.png"
function Logotipo() {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2">
        <img src="iuta-logo-png.png" className="w-12 h-12" alt="Logo" />
        <h3 className="font-bold text-2xl text-white">IUTA App</h3>
      </Link>
    </div>
  );
}

export default Logotipo;
