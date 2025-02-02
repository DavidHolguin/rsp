import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TermsAndConditions = () => {
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

        <h1 className="text-4xl font-bold mb-8 text-white">Términos y Condiciones</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Información de la Empresa</h2>
              <p className="text-gray-300 leading-relaxed">
                {agencyInfo ? (
                  <>
                    {agencyInfo.name} con correo electrónico {agencyInfo.contact_email} y número de contacto {agencyInfo.contact_phone}, 
                    en adelante "la Empresa", establece los siguientes términos y condiciones para el uso de sus servicios.
                  </>
                ) : (
                  "Cargando información de la empresa..."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso del Servicio de WhatsApp Business API</h2>
              <p className="text-gray-300 leading-relaxed">
                Al utilizar nuestro servicio a través de WhatsApp Business API, usted acepta:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>No enviar mensajes masivos o spam</li>
                  <li>No utilizar el servicio para fines ilegales o no autorizados</li>
                  <li>Respetar las políticas de uso de WhatsApp Business</li>
                  <li>Mantener la confidencialidad de las comunicaciones</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Protección de Datos</h2>
              <p className="text-gray-300 leading-relaxed">
                Sus datos serán tratados conforme a las leyes de protección de datos aplicables y nuestra política de privacidad.
                La empresa se compromete a:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Proteger la información personal del usuario</li>
                  <li>No compartir datos con terceros sin consentimiento</li>
                  <li>Mantener medidas de seguridad apropiadas</li>
                  <li>Permitir al usuario ejercer sus derechos ARCO</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Limitación de Responsabilidad</h2>
              <p className="text-gray-300 leading-relaxed">
                La empresa no será responsable por:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Interrupciones del servicio de WhatsApp</li>
                  <li>Pérdida de datos durante la transmisión</li>
                  <li>Uso indebido del servicio por parte del usuario</li>
                  <li>Daños indirectos o consecuentes</li>
                </ul>
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TermsAndConditions;