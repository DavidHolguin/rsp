import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UsagePolicies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-4xl font-bold mb-8">Políticas de Uso</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Uso Aceptable</h2>
              <p className="text-muted-foreground leading-relaxed">
                El servicio debe utilizarse de manera responsable y ética. No se permite el uso del servicio para actividades ilegales
                o que violen los derechos de otros usuarios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Contenido del Usuario</h2>
              <p className="text-muted-foreground leading-relaxed">
                Los usuarios son responsables de todo el contenido que comparten a través del servicio. El contenido debe ser apropiado
                y no violar derechos de autor u otros derechos de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Seguridad</h2>
              <p className="text-muted-foreground leading-relaxed">
                Los usuarios deben mantener la seguridad de sus credenciales de acceso y notificar inmediatamente cualquier uso no autorizado
                de su cuenta o cualquier brecha de seguridad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Monitoreo y Cumplimiento</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de monitorear el uso del servicio para garantizar el cumplimiento de estas políticas
                y tomar medidas apropiadas en caso de violación.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsagePolicies;