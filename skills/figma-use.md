# figma-use

Skill base para trabajar en el canvas de Figma.

## Principios de trabajo

1. Lee antes de escribir — llama figma_get_variables y figma_search_components primero. Nunca inventes valores.
2. Usa el sistema de diseño — aplica siempre variables del archivo activo.
3. Nombra capas con criterio — Frames: [Flujo]/[Número] - [Nombre]. Grupos: minúsculas.
4. Organiza en el canvas — frames izquierda a derecha, 80px separación, agrupados en sección.
5. Auto Layout primero — nunca posiciones absolutas en layouts.
6. Itera con capturas — screenshot después de cada frame antes de continuar.
7. Comunica lo que haces — explica cada acción antes de ejecutarla.

## Frame mobile
- 375x812px
- Padding: 24px horizontal, 48px top, 32px bottom
- Safe area top: 44px, bottom: 34px

## Frame desktop
- 1440x900px
- Max-width contenido: 1200px centrado

## Errores a evitar
- No hardcodear colores si existe variable
- No usar fuentes fuera del archivo
- No crear componentes si ya existen en el sistema de diseño
- No dejar capas sin nombre
