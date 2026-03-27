# figma-murdoc

Servidor MCP de diseño para equipos. Conecta Claude con Figma Desktop para generar pantallas, documentar componentes, preparar handoffs y auditar sistemas de diseño.

## Qué es este servidor

Figma Murdoc expone herramientas del canvas de Figma a través del protocolo MCP. Funciona exclusivamente con **Figma Desktop** y el plugin **Figma Desktop Bridge** activo. Sin el plugin abierto, ninguna operación de escritura es posible.

No adivines valores. No inventes componentes. No uses colores hardcodeados. Todo lo que generes debe provenir del sistema de diseño del archivo activo.

---

## Requisitos antes de ejecutar cualquier tarea

Antes de responder cualquier petición relacionada con Figma, verifica estos tres puntos en orden:

1. **Plugin activo** — llama a `figma_get_status`. Si no hay conexión WebSocket, detente y pide al usuario que abra el plugin en Figma Desktop.

2. **Archivo correcto** — confirma con el usuario qué archivo debe estar activo. Llama a `figma_list_open_files` si hay dudas.

3. **Sistema de diseño cargado** — antes de crear cualquier elemento visual, llama siempre a:
   - `figma_get_variables` → colores, tipografías, espaciados, radios
   - `figma_search_components` → botones, inputs, cards, navegación, iconos

---

## Flujo de trabajo estándar

Cada tarea sigue este ciclo:

1. VERIFICAR   → estado del plugin y archivo activo
2. LEER        → variables y componentes disponibles
3. PLANIFICAR  → describir al usuario qué se va a crear antes de hacerlo
4. EJECUTAR    → crear en Figma usando el sistema de diseño
5. VERIFICAR   → screenshot del resultado (figma_capture_screenshot)
6. ITERAR      → corregir si hay problemas (máximo 3 iteraciones)
7. REPORTAR    → resumen de lo creado al usuario

Nunca saltes el paso 2. Nunca saltes el paso 5.

---

## Reglas de diseño obligatorias

### Frames
- Mobile: 375x812px, padding 24px horizontal / 48px top / 32px bottom
- Safe area top: 44px · Safe area bottom: 34px
- Desktop: 1440x900px, max-width contenido 1200px centrado

### Nomenclatura de capas
- Frames de flujo: [Flujo]/[Número] - [Nombre] → Onboarding/01 - Bienvenida
- Grupos funcionales: minúsculas → header, cta-section, form-fields
- Nunca dejar capas con nombres por defecto: "Frame 1", "Rectangle 2", "Group 5"

### Organización en el canvas
- Siempre crear frames dentro de una Section con el nombre del flujo
- Frames de izquierda a derecha con 80px de separación
- Nunca elementos flotando sin contenedor

### Variables y tokens
- Usar siempre las variables del archivo. Nunca hardcodear colores, fuentes, espaciados, radios
- Verificar con figma_get_variables antes de asignar cualquier valor

### Auto Layout
- Usar Auto Layout en todos los frames y contenedores
- Nunca posicionar con coordenadas absolutas dentro de un layout

### Componentes
- Buscar siempre antes de crear con figma_search_components
- Si falta un componente, crear versión temporal prefijada con _temp/ y notificar

---

## Skills disponibles

Llama a list_skills para ver los disponibles. Usa use_skill para cargar uno.

| Quiero... | Skill |
|---|---|
| Generar pantallas de un flujo | generate-screen |
| Documentar un componente o flujo | generate-documentation |
| Preparar diseños para desarrollo | prepare-handoff |
| Detectar problemas de calidad | audit-quality |
| Exportar variables a CSS/Tailwind | sync-tokens |
| Conectar diseños al sistema de diseño | apply-design-system |

---

## Errores comunes — no los cometas

- Crear colores sin verificar variables → llamar figma_get_variables primero
- Crear componentes desde cero → buscar con figma_search_components primero
- Dejar capas sin nombre → siempre nombrar con la convención del equipo
- No verificar el resultado → siempre figma_capture_screenshot después de crear
- Continuar tras error de conexión → detener y pedir verificar el plugin
- Cambios destructivos sin confirmar → siempre pedir confirmación antes de borrar

---

## Limitaciones conocidas

- Solo funciona con Figma Desktop, no con Figma en el navegador
- Los nodeIds son específicos de cada sesión — no reutilices IDs de conversaciones anteriores
- Los cambios son reversibles con Cmd+Z en Figma, pero no desde el servidor MCP
