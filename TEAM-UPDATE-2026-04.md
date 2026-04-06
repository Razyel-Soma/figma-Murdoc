# Murdoc Update — Abril 2026

## Resumen

Murdoc pasó de 11 a **15 skills** con soporte para slots nativos de Figma, generación de librerías desde código, y specs de accesibilidad para screen readers. También se corrigieron bugs críticos en la Plugin API que causaban fallos silenciosos.

---

## Bugs corregidos

### `use_skill` roto (crítico)
El schema de Zod rechazaba los parámetros del tool. Se corrigió la validación — ahora `list_skills` y `use_skill` funcionan correctamente.

### Effects con `spread` y `blendMode` (crítico)
La documentación en `figma-murdoc.md` decía que `spread` y `blendMode` eran **obligatorios** en effects. Era **exactamente al revés** — esas propiedades NO existen en la Plugin API. Esto causaba que todas las sombras fallaran silenciosamente. Corregido en todos los skills.

### APIs sync deprecadas
`figma.getNodeById()` y `figma.currentPage = x` fallan en modo dynamic-page. Todos los skills ahora documentan las versiones async como obligatorias: `getNodeByIdAsync()`, `setCurrentPageAsync()`, `loadFontAsync()`, `exportAsync()`.

### Timeout de 5 segundos insuficiente
El timeout default de `figma_execute` (5000ms) no alcanzaba para operaciones complejas. Los skills ahora incluyen una guía de timeouts de 5s a 30s según la operación.

### Respuestas truncadas
Las respuestas del plugin se cortaban por devolver nodos completos. Los skills ahora incluyen reglas de código compacto: devolver solo `{ id, name }` y dividir operaciones grandes.

---

## Skills nuevos (4)

### `generate-library`
Crea una librería de componentes en Figma a partir de un codebase existente. Soporta React, Vue, Angular y Svelte. Analiza el código, extrae props/variantes/tokens, y recrea los componentes como assets nativos de Figma con component properties correctas (TEXT, BOOLEAN, INSTANCE_SWAP, VARIANT). Sigue orden atómico: primitivos → átomos → moléculas → organismos.

### `create-voice`
Genera especificaciones de screen reader para VoiceOver (iOS), TalkBack (Android) y ARIA (Web). Analiza las pantallas, identifica elementos interactivos/informativos/decorativos, y genera specs con `accessibilityLabel`, traits, hints, roles y orden de lectura. Anota directamente en Figma y produce un documento de spec completo. Inspirado en el trabajo de Ian Guisard (Uber).

### `migrate-to-slots`
Audita una librería de componentes para detectar candidatos a migración a slots nativos de Figma (open beta marzo 2026). Detecta componentes con >8 variantes, props INSTANCE_SWAP, y capas ocultas. Reestructura la jerarquía interna y prepara frames slot-ready para que el diseñador solo haga "Convert to slot" con un click.

### `slot-patterns`
Define patrones de composición con slots para los componentes más comunes: Card (slot-body + slot-actions), Modal (slot-body + slot-footer), ListItem (slot-leading + slot-trailing), NavBar (slot-nav-items), FormSection (slot-fields). Incluye código de ejemplo para crear frames slot-ready.

---

## Skills actualizados (5)

### `figma-use`
Se agregó una sección completa de **Reglas críticas para figma_execute** con:
- Tabla de APIs async obligatorias vs deprecadas
- Propiedades válidas por tipo de effect
- Guía de timeouts por tipo de operación
- Reglas de código compacto
- Limitaciones conocidas (REST API, comentarios, anotaciones, slots)

### `generate-screen`
- Bloque de reglas obligatorias en el paso de generación (async, fonts, timeout, effects, dividir)
- Nota de timeout para múltiples frames
- Dashboard dividido en 3 llamadas explícitas
- Sección de componentes slot-ready con naming conventions
- Patrón de código de referencia completo

### `prepare-handoff`
- Reglas de timeout para escaneos (20-30s)
- Patrón de código para escaneo de tokens con límite de resultados
- Fallback de Plugin API cuando `figma_get_variables` devuelve vacío
- Fallback `setPluginData` cuando anotaciones no funcionan
- **Nuevo paso 5.5:** Mapeo de slots a código (React children, Vue slot, Angular ng-content)

### `audit-quality`
- **Nuevo paso 5:** Detección de oportunidades de slots (componentes con >8 variantes, INSTANCE_SWAP, etc.)
- Sección de "Oportunidades de slots" en el reporte

### `figma-murdoc.md` (instrucciones de arranque)
- Corregida sección de Effects (estaba al revés)
- Agregadas `loadFontAsync` y `exportAsync` a la lista de async
- Nueva sección de código compacto
- Limitaciones expandidas: Variables REST, Comentarios, Anotaciones, Slots

---

## Estado de los slots en la Plugin API

| Operación | Soportado |
|---|---|
| Detectar slots (`node.type === "SLOT"`) | ✅ |
| Leer propiedades de slots | ✅ |
| Recorrer hijos dentro de un slot | ✅ |
| Crear un slot programáticamente | ❌ |
| Modificar contenido de slot en instancia | ❌ |

Cuando Figma agregue `SLOT` a `ComponentPropertyType`, Murdoc podrá crear slots programáticamente. Por ahora, preparamos la estructura y el diseñador hace "Convert to slot" con un click.

---

## Infraestructura

- **Fuente única de verdad:** `~/figma-bridge-soma` = GitHub (`Razyel-Soma/figma-Murdoc`)
- **Para actualizar:** `git pull origin main` (no necesita rebuild para cambios en skills)
- **Para rebuild:** `npm run build:local` (solo si cambia código TypeScript)
- **Token de Figma:** Configurado en `~/.claude.json` como `FIGMA_ACCESS_TOKEN`

---

## Conteo total

| Categoría | Antes | Ahora |
|---|---|---|
| Skills | 11 | **15** |
| Bugs corregidos | — | **5** |
| Skills actualizados | — | **5** |
| Plataformas de a11y | 0 | **3** (VoiceOver, TalkBack, ARIA) |
| Patrones de slots | 0 | **5** (Card, Modal, ListItem, NavBar, Form) |
