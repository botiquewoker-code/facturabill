import { Settings, Upload } from "lucide-react";

type Props = {
  mostrar: boolean;
  setMostrar: (v: boolean) => void;
  empresa: any;
  setEmpresa: any;
  logo: string;
  setLogo: (v: string) => void;
  notas: string;
  setNotas: (v: string) => void;
};

export default function ConfigPanel({
  mostrar,
  setMostrar,
  empresa,
  setEmpresa,
  logo,
  setLogo,
  notas,
  setNotas,
}: Props) {
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-2xl font-bold">Configuración de empresa</h2>
          <button
            onClick={() => setMostrar(false)}
            className="text-3xl leading-none hover:opacity-80"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Datos de empresa */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Datos de empresa
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="Nombre / Razón social"
                value={empresa.nombre}
                onChange={(e) =>
                  setEmpresa({ ...empresa, nombre: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="NIF/CIF"
                value={empresa.nif}
                onChange={(e) =>
                  setEmpresa({ ...empresa, nif: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="Dirección"
                value={empresa.direccion}
                onChange={(e) =>
                  setEmpresa({ ...empresa, direccion: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="Ciudad"
                value={empresa.ciudad}
                onChange={(e) =>
                  setEmpresa({ ...empresa, ciudad: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="Código Postal"
                value={empresa.cp}
                onChange={(e) => setEmpresa({ ...empresa, cp: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="Teléfono"
                value={empresa.telefono}
                onChange={(e) =>
                  setEmpresa({ ...empresa, telefono: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                placeholder="Email"
                value={empresa.email}
                onChange={(e) =>
                  setEmpresa({ ...empresa, email: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Logo de empresa
            </h3>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="hidden"
              />
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="mx-auto max-h-48 rounded-2xl shadow-lg"
                />
              ) : (
                <div className="h-48 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Subir logo</p>
                </div>
              )}
            </label>
          </div>

          {/* Notas */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Notas / Condiciones
            </h3>
            <textarea
              placeholder="Condiciones de pago, notas adicionales..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
