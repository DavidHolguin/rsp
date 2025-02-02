import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UsagePolicies = () => {
  const navigate = useNavigate();
  const [agencyInfo, setAgencyInfo] = useState<any>(null);

  useEffect(() => {
    const fetchAgencyInfo = async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .single();
      
      if (!error && data) {
        setAgencyInfo(data);
      }
    };

    fetchAgencyInfo();
  }, []);

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

        <h1 className="text-4xl font-bold mb-8 text-white">Políticas de Uso</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Información General</h2>
              <p className="text-gray-300 leading-relaxed">
                {agencyInfo ? (
                  <>
                    {agencyInfo.name}, con datos de contacto:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Email: {agencyInfo.contact_email}</li>
                      <li>Teléfono: {agencyInfo.contact_phone}</li>
                    </ul>
                  </>
                ) : (
                  "Cargando información de la empresa..."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Políticas de Comunicación por WhatsApp</h2>
              <p className="text-gray-300 leading-relaxed">
                Para garantizar un servicio de calidad a través de WhatsApp Business API:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Los mensajes deben ser relacionados exclusivamente con el servicio</li>
                  <li>Se debe respetar el horario de atención establecido</li>
                  <li>No se permite el uso de lenguaje inapropiado o abusivo</li>
                  <li>Las respuestas automáticas están limitadas a ciertos horarios</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Gestión de Datos</h2>
              <p className="text-gray-300 leading-relaxed">
                El uso de WhatsApp Business API implica:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Almacenamiento temporal de mensajes para servicio al cliente</li>
                  <li>Procesamiento de datos para mejora del servicio</li>
                  <li>Protección de información según normativas vigentes</li>
                  <li>Derecho a solicitar eliminación de datos</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Restricciones de Uso</h2>
              <p className="text-gray-300 leading-relaxed">
                Está prohibido:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Usar el servicio para spam o mensajes no solicitados</li>
                  <li>Compartir contenido ilegal o inapropiado</li>
                  <li>Intentar acceder a información de otros usuarios</li>
                  <li>Usar bots no autorizados</li>
                </ul>
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsagePolicies;