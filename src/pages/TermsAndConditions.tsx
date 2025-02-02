import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1F2C34] text-white">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-[#2A3942] text-gray-300"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-4xl font-bold mb-8 text-white">Términos y Condiciones</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Aceptación de los Términos</h2>
              <p className="text-gray-300 leading-relaxed">
                Al acceder y utilizar este servicio de chat, usted acepta estar sujeto a estos términos y condiciones de uso.
                Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso del Servicio</h2>
              <p className="text-gray-300 leading-relaxed">
                El servicio se proporciona "tal cual" y está destinado a facilitar la comunicación entre usuarios y nuestro sistema automatizado.
                Usted se compromete a utilizar el servicio de manera apropiada y legal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Privacidad y Datos</h2>
              <p className="text-gray-300 leading-relaxed">
                Nos comprometemos a proteger su privacidad y manejar sus datos personales de acuerdo con nuestra política de privacidad.
                Al utilizar nuestro servicio, acepta la recopilación y uso de información de acuerdo con esta política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Limitación de Responsabilidad</h2>
              <p className="text-gray-300 leading-relaxed">
                No seremos responsables de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso
                o la imposibilidad de usar nuestro servicio.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TermsAndConditions;