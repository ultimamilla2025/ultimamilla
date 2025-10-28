import {
  AlertCircle,
  ShieldAlert,
  Database,
  ServerCrash,
  Lock,
  AlertTriangle,
} from "lucide-react";

interface ErrorDisplayProps {
  /** Tipo de error para mostrar el icono y estilo apropiado */
  type?: "error" | "warning" | "access-denied" | "database" | "server";

  /** Título principal del error */
  title?: string;

  /** Mensaje de error detallado */
  message?: string;

  /** Error object de JavaScript/TypeScript (opcional) */
  error?: Error | unknown;

  /** Mostrar detalles técnicos (solo en desarrollo) */
  showDetails?: boolean;

  /** Clase CSS adicional para el contenedor */
  className?: string;

  /** Acción opcional con botón */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ErrorDisplay({
  type = "error",
  title,
  message,
  error,
  showDetails = process.env.NODE_ENV === "development",
  className = "",
  action,
}: ErrorDisplayProps) {
  // Configuración de estilos según el tipo de error
  const config = {
    error: {
      icon: <AlertCircle className="w-16 h-16" />,
      iconColor: "text-red-400",
      bgGradient: "from-red-900/20 via-red-800/10 to-red-900/20",
      borderColor: "border-red-500/30",
      titleDefault: "Error",
      glowColor: "shadow-red-500/20",
    },
    warning: {
      icon: <AlertTriangle className="w-16 h-16" />,
      iconColor: "text-yellow-400",
      bgGradient: "from-yellow-900/20 via-yellow-800/10 to-yellow-900/20",
      borderColor: "border-yellow-500/30",
      titleDefault: "Advertencia",
      glowColor: "shadow-yellow-500/20",
    },
    "access-denied": {
      icon: <Lock className="w-16 h-16" />,
      iconColor: "text-orange-400",
      bgGradient: "from-orange-900/20 via-orange-800/10 to-orange-900/20",
      borderColor: "border-orange-500/30",
      titleDefault: "Acceso Denegado",
      glowColor: "shadow-orange-500/20",
    },
    database: {
      icon: <Database className="w-16 h-16" />,
      iconColor: "text-purple-400",
      bgGradient: "from-purple-900/20 via-purple-800/10 to-purple-900/20",
      borderColor: "border-purple-500/30",
      titleDefault: "Error de Base de Datos",
      glowColor: "shadow-purple-500/20",
    },
    server: {
      icon: <ServerCrash className="w-16 h-16" />,
      iconColor: "text-red-400",
      bgGradient: "from-red-900/20 via-red-800/10 to-red-900/20",
      borderColor: "border-red-500/30",
      titleDefault: "Error del Servidor",
      glowColor: "shadow-red-500/20",
    },
  };

  const currentConfig = config[type];

  // Extraer mensaje de error si es un objeto Error
  const errorMessage =
    error instanceof Error ? error.message : String(error || "");
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div
      className={`
        min-h-screen w-full 
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
        flex items-center justify-center 
        p-4 sm:p-8
        ${className}
      `}
    >
      <div
        className={`
          max-w-2xl w-full
          bg-gradient-to-br ${currentConfig.bgGradient}
          backdrop-blur-md
          border ${currentConfig.borderColor}
          rounded-2xl
          shadow-2xl ${currentConfig.glowColor}
          p-8 sm:p-12
          space-y-6
          animate-in fade-in duration-500
        `}
      >
        {/* Icono */}
        <div className="flex justify-center">
          <div
            className={`
              ${currentConfig.iconColor} 
              opacity-80
              animate-pulse
            `}
          >
            {currentConfig.icon}
          </div>
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {title || currentConfig.titleDefault}
          </h1>

          {/* Mensaje principal */}
          {message && (
            <p className="text-lg text-gray-300 leading-relaxed">{message}</p>
          )}
        </div>

        {/* Detalles del error (solo en desarrollo) */}
        {showDetails && errorMessage && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-semibold">Detalles técnicos:</span>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-lg p-4 overflow-auto">
              <code className="text-sm text-red-300 font-mono break-all">
                {errorMessage}
              </code>
            </div>

            {/* Stack trace (colapsado por defecto) */}
            {errorStack && (
              <details className="group">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors">
                  Ver stack trace
                </summary>
                <div className="mt-2 bg-black/30 border border-white/10 rounded-lg p-4 overflow-auto max-h-64">
                  <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                    {errorStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        )}

        {/* Acción/Botón */}
        {action && (
          <div className="flex justify-center pt-4">
            <button
              onClick={action.onClick}
              className={`
                px-6 py-3 
                rounded-lg 
                font-semibold
                transition-all duration-300
                ${currentConfig.iconColor}
                bg-white/10 hover:bg-white/20
                border ${currentConfig.borderColor}
                hover:scale-105
                active:scale-95
              `}
            >
              {action.label}
            </button>
          </div>
        )}

        {/* Info adicional */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-sm text-gray-500">
            Si el problema persiste, contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
}
