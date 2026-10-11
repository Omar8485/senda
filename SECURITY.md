# Seguridad

## Cómo reportar una vulnerabilidad

Escribe a **infostark.computer@gmail.com** con el asunto "Seguridad Senda". No abras un *issue* público para una vulnerabilidad. Respondemos lo antes posible y te avisamos cuando esté corregida.

## Qué protege Senda

- **Sin servidor del proyecto.** Los datos viven en el dispositivo de cada persona; no hay base central que filtrar.
- **Las claves de API las pone cada usuario** y se guardan solo en su dispositivo. Nunca van al repositorio ni a la sincronización, salvo que la persona lo pida de forma explícita.
- **Sin scripts de terceros** y con política de seguridad de contenido estricta en la app compilada.

## Reglas para quienes contribuyen

- **Nunca subas claves, tokens, contraseñas ni archivos `.env`.** Están en `.gitignore`, y la CI revisa todo el historial con [gitleaks](https://github.com/gitleaks/gitleaks) en cada push.
- **Nunca subas datos personales reales**, ni tuyos ni de otras personas. Los ejemplos y datos de prueba se inventan.
- Si subiste un secreto por error, **revócalo de inmediato** en el servicio que lo emitió: borrarlo del repositorio no basta, porque queda en el historial.
