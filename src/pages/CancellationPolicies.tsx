import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CancellationPolicies = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [hotelInfo, setHotelInfo] = useState<any>(null);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      if (hotelId) {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', hotelId)
          .single();
        
        if (!error && data) {
          setHotelInfo(data);
        }
      }
    };

    fetchHotelInfo();
  }, [hotelId]);

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
            {hotelInfo && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">Hotel: {hotelInfo.name}</h2>
                <p className="text-gray-300 mb-4">
                  Ubicación: {hotelInfo.address}, {hotelInfo.city}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Plazos de Cancelación</h2>
              <p className="text-gray-300 leading-relaxed">
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Cancelación gratuita hasta 48 horas antes del check-in</li>
                  <li>Cancelación con 24-48 horas de anticipación: 50% de cargo</li>
                  <li>Cancelación con menos de 24 horas: cargo completo</li>
                  <li>No show: cargo completo de la reserva</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Proceso de Reembolso</h2>
              <p className="text-gray-300 leading-relaxed">
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Los reembolsos se procesarán en un plazo de 5-10 días hábiles</li>
                  <li>Se realizarán usando el mismo método de pago original</li>
                  <li>Las cancelaciones deben solicitarse por escrito</li>
                  <li>Se enviará confirmación por email de la cancelación</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Modificaciones de Reserva</h2>
              <p className="text-gray-300 leading-relaxed">
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Cambios de fecha sujetos a disponibilidad</li>
                  <li>Modificaciones sin cargo hasta 72 horas antes</li>
                  <li>Cambios de titular permitidos sin costo</li>
                  <li>Extensiones de estancia sujetas a disponibilidad</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Casos Especiales</h2>
              <p className="text-gray-300 leading-relaxed">
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Cancelaciones por emergencias médicas (con comprobante)</li>
                  <li>Casos de fuerza mayor</li>
                  <li>Cancelaciones por parte del hotel</li>
                  <li>Situaciones especiales evaluadas caso por caso</li>
                </ul>
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CancellationPolicies;