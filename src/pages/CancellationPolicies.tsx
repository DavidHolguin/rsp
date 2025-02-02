import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CancellationPolicies = () => {
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

        <h1 className="text-4xl font-bold mb-8 text-white">Políticas de Cancelación</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Proceso de Cancelación</h2>
              <p className="text-gray-300 leading-relaxed">
                Las cancelaciones deben realizarse a través de nuestro sistema o contactando directamente con nuestro servicio al cliente.
                Cada cancelación será procesada de acuerdo con los términos específicos del servicio contratado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Plazos de Cancelación</h2>
              <p className="text-gray-300 leading-relaxed">
                Los plazos de cancelación varían según el tipo de servicio. Es importante revisar los términos específicos
                de cada servicio al momento de la contratación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Reembolsos</h2>
              <p className="text-gray-300 leading-relaxed">
                La política de reembolsos está sujeta al tiempo de anticipación de la cancelación y al tipo de servicio contratado.
                Los reembolsos se procesarán utilizando el método de pago original.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Modificaciones</h2>
              <p className="text-gray-300 leading-relaxed">
                Las modificaciones a reservas existentes se tratarán como una cancelación seguida de una nueva reserva,
                y estarán sujetas a las políticas de cancelación vigentes.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CancellationPolicies;