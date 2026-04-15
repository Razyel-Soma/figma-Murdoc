---
name: html-to-figma
description: >
  Skill para migrar prototipos HTML/React generados en Claude Desktop o Claude Code hacia Figma como un design system completo con tokens, componentes y pantallas editables. Usa este skill cuando el usuario quiera: llevar un prototipo HTML a Figma, crear un design system a partir de código generado, migrar flujos de una app web a Figma para que el equipo de diseño los retome, convertir artefactos de Claude (artifacts HTML/React/JSX) en componentes nativos de Figma, o cuando mencione "pasar esto a Figma", "que diseño lo retome", "migrar a Figma", "generar el DS desde el código". También aplica cuando el usuario pega código HTML/CSS/React directamente en el chat y quiere verlo materializado en Figma.
---

# html-to-figma

Skill para migrar prototipos HTML/React/JSX generados en Claude Desktop, Claude Code, o cualquier fuente de código hacia Figma. Produce un archivo Figma con design tokens, componentes nativos y pantallas listas para que el equipo de diseño itere.

## Prerequisito
- Carga figma-use antes de ejecutar este skill (se incluye automáticamente).
- Figma Desktop abierto con el archivo destino y el plugin Desktop Bridge corriendo.

## Cuándo usar este skill
- El usuario generó un HTML/React en Claude y quiere llevarlo a Figma
- El usuario quiere crear un design system a partir de un prototipo funcional
- El equipo de diseño necesita retomar un prototipo generado por IA
- El usuario pega código HTML/CSS/JSX/TSX y dice "pásalo a Figma"
- Se necesita migrar flujos completos de una web app a componentes de Figma

## Flujo general

```
HTML/React/CSS (input)
       │
       ▼
┌─────────────────────┐
│  0. ANÁLISIS        │ → Claude lee y entiende el HTML completo
│     SEMÁNTICO       │   (NO regex — comprensión de lenguaje)
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  1. EXTRACCIÓN      │ → Tokens CSS + estructura de componentes
│     DE TOKENS       │   (parser automático + validación Claude)
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  2. CREACIÓN DE     │ → CSS vars / Tailwind → Figma Variables
│     TOKENS FIGMA    │   (colores, tipografía, spacing, radii)
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  3. COMPONENTES     │ → Cada componente con CONTENIDO REAL
│     DE ALTA         │   del HTML, no placeholders genéricos
│     FIDELIDAD       │
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  4. PANTALLAS       │ → TODAS las pantallas del flujo,
│     COMPLETAS       │   con contenido real y jerarquía visual
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  5. HANDOFF         │ → Documentar, anotar, entregar a diseño
└─────────────────────┘
```

## Paso 0 — Análisis Semántico (CRÍTICO — lo hace Claude, NO el parser)

> ⚠️ Este paso es el más importante y el que diferencia una migración mecánica
> (4/10) de una migración de alta fidelidad (8-9/10). Claude DEBE leer y entender
> el HTML completo antes de tocar Figma.

### Cómo obtener el HTML

Claude debe primero obtener el código fuente completo usando una de estas vías:

- **Archivo subido**: Leer desde `/mnt/user-data/uploads/` con `view` o `bash cat`
- **Código pegado en el chat**: Ya está en contexto, leer directamente
- **Referencia a artefacto previo**: Buscar con `conversation_search`
- **URL de un deploy**: Obtener con `web_fetch`

> ⚠️ Claude DEBE leer TODO el contenido (HTML + CSS + JS) antes de continuar.
> No saltar secciones, no resumir. Leer cada línea para entender la app completa.

### Qué debe hacer Claude en este paso

1. **Leer el HTML completo** — No un resumen, no fragments. Claude lee CADA línea
   del HTML, CSS y JavaScript para entender la aplicación como un todo.

2. **Identificar la Arquitectura de Información:**
   - ¿Cuántas pantallas/vistas tiene la app?
   - ¿Cuál es el flujo de navegación? (ej: Splash → Landing → Dashboard)
   - ¿Hay roles de usuario? (ej: Veterinario vs Tutor)
   - ¿Hay tabs, modales, drawers, overlays?
   - ¿Qué secciones tiene cada pantalla?

3. **Extraer el contenido REAL de cada pantalla:**
   Para cada pantalla, Claude debe listar:
   - Título y subtítulo exactos
   - Textos de cada sección
   - Datos de ejemplo (nombres, números, fechas)
   - Labels de botones y acciones
   - Contenido de listas y cards

4. **Mapear el sistema visual con precisión:**
   - Familia tipográfica y pesos usados (ej: Nunito 400-900)
   - Sistema de sombras (ej: clay morphism con 3 estados)
   - Gradientes específicos (ej: linear-gradient 135deg)
   - Border-radius por tipo de componente
   - Paleta de colores con nombres semánticos

5. **Inventariar componentes CON variantes:**
   Para cada componente, Claude identifica:
   - Nombre descriptivo
   - Variantes (estados, tamaños, colores)
   - Props editables (textos, toggles)
   - Contenido de ejemplo real del HTML
   - Cómo se compone con otros componentes

### Formato del output del análisis semántico

Claude debe producir un documento estructurado antes de crear nada en Figma:

```
## Arquitectura de Información

### Flujo de navegación
Splash (2.2s) → Landing (selección rol) → [Vet Dashboard | Tutor Dashboard]
Tutor Dashboard: Tab Bar [Inicio | Salud | Premios | Tips] + Bottom Nav

### Pantallas (6 total)
1. Splash — logo animado, auto-dismiss
2. Landing — logo, tagline, 2 role cards
3. Home (Tutor) — hero pet, reminder, stats, quick actions
4. Salud — dose tracker, OA status, vet info, emergency
5. Premios — points, earning activities, rebates, streak
6. Tips — consejos, suplementos carousel, diary

### Componentes inventariados (15)
1. Clay Card — base del sistema, 3 estados de sombra
2. Clay Button — Primary (gradient) / Outline
3. Badge — 5 variantes de color (teal, green, orange, red, primary)
...etc

### Contenido real por pantalla
#### Landing
- Logo: "Huella" (Nunito 900, 50px) + bar rotada -15deg
- Subtítulo: "BY ELANCO" (Nunito 800, 13px, spacing .2em, uppercase)
- Descripción: "Cuidado inteligente para tu mascota..."
- Role Card 1: icon stethoscope, "Veterinario", "Gestiona pacientes y tratamientos"
- Role Card 2: icon heart, "Tutor", "Cuida la salud de tu mascota"
...etc
```

### Por qué este paso es crítico

Sin análisis semántico, el skill genera:
- Componentes con texto "Card Title" y "Button Label" (genéricos)
- Una sola pantalla "Home" ensamblada mecánicamente
- Sin flujo de navegación entre pantallas
- Sin contenido real que permita al equipo de diseño entender la app

Con análisis semántico, el skill genera:
- Componentes con "Galliprant 8:00 AM" y "Enviar alerta urgente" (reales)
- 6 pantallas completas con todo el contenido del HTML
- Flujo de navegación visible en Figma (secciones organizadas)
- El equipo de diseño puede iterar inmediatamente

### Output obligatorio: Diagrama de Arquitectura en Figma

Una vez completado el análisis semántico (que Claude presenta en el chat como
documento estructurado), el siguiente paso es **materializar ese análisis
en Figma** como un diagrama visual.

Este diagrama es el PRIMER artefacto que se crea en Figma — antes de tokens,
antes de componentes, antes de pantallas. Es el "mapa" del proyecto.

El diagrama debe vivir en una sección dedicada "📐 Architecture" y contener:

1. **Título y metadata** — nombre del proyecto, fuente del análisis
2. **Flujo de navegación** — cajas para cada pantalla conectadas por flechas
   que muestran el flujo (ej: Splash → Landing → Dashboard)
3. **Contenido por pantalla** — cada caja lista los elementos clave con
   contenido REAL del HTML (no genérico)
4. **Elementos compartidos** — nota con componentes que se repiten entre
   pantallas (Header, Tab Bar, Bottom Nav, etc.)
5. **Sistema visual** — nota con la paleta, tipografía, y estilo (ej: clay
   morphism, gradientes, etc.)

Este diagrama es el "mapa" que el equipo de diseño usa para entender
la app antes de iterar. Sin él, las pantallas en Figma carecen de
contexto y el diseñador no sabe qué flujo conecta qué.

## Paso 1 — Extracción de Tokens (parser + Claude)

### Fuentes válidas de input

**A) Código pegado en el chat**
El usuario pega HTML/CSS/JSX directamente. Analizar en contexto.

**B) Archivo subido**
El usuario sube un .html, .jsx, .tsx, .css. Leer desde `/mnt/user-data/uploads/`.

**C) Referencia a un artefacto previo**
El usuario dice "el HTML que generamos antes". Buscar en conversaciones previas con `conversation_search`.

**D) URL de un deploy**
El usuario comparte una URL. Usar `web_fetch` para obtener el HTML/CSS.

### Qué extraer del código

Analizar el código para producir un **spec JSON intermedio** con esta estructura:

```json
{
  "meta": {
    "nombre": "App de Reservaciones",
    "fuente": "artifact-react",
    "framework": "react",
    "css_approach": "tailwind"
  },
  "tokens": {
    "colors": {
      "primary": { "light": "#3B82F6", "dark": "#60A5FA" },
      "secondary": { "light": "#10B981", "dark": "#34D399" },
      "background": { "light": "#FFFFFF", "dark": "#0F172A" },
      "surface": { "light": "#F8FAFC", "dark": "#1E293B" },
      "text-primary": { "light": "#0F172A", "dark": "#F8FAFC" },
      "text-secondary": { "light": "#64748B", "dark": "#94A3B8" },
      "border": { "light": "#E2E8F0", "dark": "#334155" },
      "error": { "light": "#EF4444", "dark": "#F87171" },
      "success": { "light": "#22C55E", "dark": "#4ADE80" }
    },
    "typography": {
      "heading-xl": { "family": "Inter", "size": 32, "weight": "Bold", "lineHeight": 40 },
      "heading-lg": { "family": "Inter", "size": 24, "weight": "SemiBold", "lineHeight": 32 },
      "heading-md": { "family": "Inter", "size": 20, "weight": "SemiBold", "lineHeight": 28 },
      "body": { "family": "Inter", "size": 16, "weight": "Regular", "lineHeight": 24 },
      "body-sm": { "family": "Inter", "size": 14, "weight": "Regular", "lineHeight": 20 },
      "caption": { "family": "Inter", "size": 12, "weight": "Regular", "lineHeight": 16 }
    },
    "spacing": {
      "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32, "2xl": 48, "3xl": 64
    },
    "radii": {
      "sm": 4, "md": 8, "lg": 12, "xl": 16, "full": 9999
    },
    "shadows": [
      { "name": "sm", "x": 0, "y": 1, "blur": 2, "color": "rgba(0,0,0,0.05)" },
      { "name": "md", "x": 0, "y": 4, "blur": 8, "color": "rgba(0,0,0,0.1)" },
      { "name": "lg", "x": 0, "y": 8, "blur": 24, "color": "rgba(0,0,0,0.15)" }
    ]
  },
  "components": [
    {
      "name": "Button",
      "variants": { "variant": ["primary", "secondary", "ghost"], "size": ["sm", "md", "lg"] },
      "props": { "label": "TEXT", "icon": "INSTANCE_SWAP", "disabled": "BOOLEAN" },
      "tokens_used": { "bg": "primary", "text": "background", "radius": "md" }
    }
  ],
  "screens": [
    {
      "name": "Home",
      "type": "desktop",
      "components_used": ["Button", "Card", "Navigation"],
      "layout": "vertical",
      "description": "Pantalla principal con hero, cards de servicios y footer"
    }
  ]
}
```

### Mapeo Tailwind → Tokens

Si el código usa Tailwind, mapear clases a tokens:

| Patrón Tailwind | Token |
|---|---|
| `bg-blue-500`, `text-blue-500` | color/primary |
| `bg-gray-50`, `bg-white` | color/background |
| `text-gray-900` | color/text-primary |
| `text-gray-500` | color/text-secondary |
| `border-gray-200` | color/border |
| `text-sm`, `text-base`, `text-lg`... | typography/* |
| `p-4`, `gap-4`, `m-4` | spacing/md (16px) |
| `rounded-md`, `rounded-lg` | radius/* |
| `shadow-sm`, `shadow-md` | shadow/* |

### Mapeo CSS Custom Properties → Tokens

Si usa CSS vars:
```css
--color-primary: #3B82F6;  → color/primary
--font-size-base: 16px;    → typography/body/size
--spacing-md: 16px;        → spacing/md
--radius-md: 8px;          → radius/md
```

### Detección de componentes

Identificar componentes analizando:
- **React/JSX**: Funciones que retornan JSX, empezando con mayúscula
- **HTML**: Elementos con clases repetidas que forman un patrón (`.card`, `.btn`, `.nav-item`)
- **Slots/children**: Props como `children`, `{props.children}`, o `<slot>` → marcar como slot-ready

Para cada componente detectado, extraer:
- Nombre
- Props con tipos (text, boolean, enum)
- Variantes (si tiene condicionales por className o switch)
- Tokens de estilo que usa (colores, tipografía, spacing)
- Composición (qué otros componentes usa)

## Paso 2 — Crear tokens en Figma

> ⚠️ `figma_setup_design_tokens` acepta máximo 100 tokens por llamada.
> Dividir en lotes si hay más.

### Orden de creación

1. **Colores** — Crear colección "Colors" con modos Light y Dark (si aplica)
2. **Typography** — Crear colección "Typography" (solo FLOAT para sizes/lineHeight)
3. **Spacing** — Crear colección "Spacing" (FLOAT)
4. **Radii** — Crear colección "Radii" (FLOAT)

### Verificación previa

Antes de crear tokens, verificar si ya existen en el archivo:
```
- figma_get_variables(format: "summary") → ver si hay colecciones existentes
- Si hay tokens → reutilizar, no duplicar
- Si hay conflicto → preguntar al usuario: ¿sobrescribir o crear nueva colección?
```

### Ejemplo de creación

```
figma_setup_design_tokens({
  collectionName: "Colors",
  modes: ["Light", "Dark"],
  tokens: [
    { name: "color/primary", resolvedType: "COLOR", values: { "Light": "#3B82F6", "Dark": "#60A5FA" } },
    { name: "color/background", resolvedType: "COLOR", values: { "Light": "#FFFFFF", "Dark": "#0F172A" } },
    ...
  ]
})
```

## Paso 3 — Crear componentes en Figma

### Principios

- Un componente por llamada a `figma_execute` con timeout adecuado
- Siempre bindear variables del DS, nunca hardcodear valores
- Seguir touch target mínimo: 44px para interactivos
- Auto Layout siempre, posiciones absolutas nunca
- Nombrar capas con criterio (no "Frame 1", "Rectangle 2")

### Orden de creación (de primitivos a compuestos)

1. **Primitivos**: Iconos placeholder, Dividers, Badges
2. **Átomos**: Button, Input, Checkbox, Radio, Switch, Avatar
3. **Moléculas**: InputField (label+input+error), Card, ListItem, Tag
4. **Organismos**: Navigation, Modal, Form, Table

### Para cada componente

1. Crear sección contenedora si no existe
2. `figma_execute` con timeout 15000-20000:
   - `loadFontAsync` para las fuentes necesarias
   - Crear el componente con Auto Layout
   - Aplicar fills con `boundVariables` del DS
   - Agregar component properties (TEXT, BOOLEAN)
   - Nombrar capas correctamente
   - Devolver `{ id, name }`
3. Si tiene variantes → crear cada variante y combinar con `combineAsVariants`
4. Si tiene slots (children/ReactNode) → crear frame `slot-*` para futura conversión
5. Screenshot de verificación

### Patrón de código para componentes

```javascript
// timeout: 15000
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });

const section = await figma.getNodeByIdAsync("SECTION_ID");
const vars = await figma.variables.getLocalVariablesAsync();

// Helper para encontrar variable
const findVar = (pattern) => vars.find(v => v.name.toLowerCase().includes(pattern.toLowerCase()));

// Crear componente
const comp = figma.createComponent();
comp.name = "Button";
comp.layoutMode = "HORIZONTAL";
comp.primaryAxisAlignItems = "CENTER";
comp.counterAxisAlignItems = "CENTER";
comp.resize(120, 44);
comp.itemSpacing = 8;
comp.paddingLeft = 16; comp.paddingRight = 16;
comp.paddingTop = 10; comp.paddingBottom = 10;

// Aplicar color del DS
const bgVar = findVar("color/primary");
if (bgVar) {
  comp.fills = [{
    type: "SOLID", color: { r: 0.23, g: 0.51, b: 0.96 },
    boundVariables: { color: { type: "VARIABLE_ALIAS", id: bgVar.id } }
  }];
}

// Corner radius
const radiusVar = findVar("radius/md");
if (radiusVar) {
  comp.setBoundVariable("cornerRadius", radiusVar);
} else {
  comp.cornerRadius = 8;
}

// Label
const label = figma.createText();
label.characters = "Button";
label.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
label.fontSize = 16;
comp.appendChild(label);
label.layoutSizingHorizontal = "HUG";

// Component property
comp.addComponentProperty("Label", "TEXT", "Button");

section.appendChild(comp);
return { id: comp.id, name: comp.name };
```

## Paso 4 — Crear pantallas

Para cada pantalla detectada en el HTML:

1. Crear frame con dimensiones según tipo:
   - Mobile: 375×812
   - Desktop: 1440×900
   - Tablet: 768×1024

2. Aplicar layout del HTML:
   - Estructura vertical/horizontal con Auto Layout
   - Instanciar componentes creados en Paso 3 con `figma_instantiate_component`
   - Configurar propiedades de las instancias

3. Agrupar en sección: "[Flujo]/[Número] - [Nombre]"

4. Screenshot de verificación

### Ejemplo de creación de pantalla

```javascript
// timeout: 25000
const section = await figma.getNodeByIdAsync("SECTION_ID");

// Frame de pantalla
const screen = figma.createFrame();
screen.name = "Home/01 - Landing";
screen.resize(1440, 900);
screen.layoutMode = "VERTICAL";
screen.primaryAxisAlignItems = "CENTER";
screen.paddingTop = 0;
screen.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

section.appendChild(screen);
return { id: screen.id, name: screen.name };
```

Luego instanciar componentes dentro:
```
figma_instantiate_component({
  nodeId: "BUTTON_ID",
  componentKey: "BUTTON_KEY",
  parentId: SCREEN_ID,
  overrides: { "Label": "Reservar ahora" },
  variant: { "variant": "primary", "size": "lg" }
})
```

## Paso 5 — Documentación y handoff

### Estructura final del archivo Figma

El archivo Figma debe contener estas secciones en orden:

1. **📐 Architecture** — Diagrama de arquitectura de información
   - Flujo de navegación completo
   - Contenido real por pantalla
   - Elementos compartidos
   - Sistema visual documentado

2. **📦 Components** — Componentes del design system
   - Organizados por tipo (primitivos → compuestos)
   - Con variantes y properties

3. **📱 Screens** — Pantallas completas del flujo
   - Todas las pantallas identificadas en Step 0
   - Con contenido real del HTML
   - Nombradas: "[Flujo]/[Número] - [Nombre]"

### Anotar componentes

Para cada componente creado, agregar anotaciones con `figma_set_annotations`:
- Equivalente en código
- Props disponibles
- Tokens usados
- Notas de comportamiento

### Generar resumen

Presentar al usuario un resumen de la migración:

```
## Migración completada ✅

### Arquitectura de Información
- Diagrama visual en sección "📐 Architecture"
- N pantallas mapeadas con flujos de navegación
- Elementos compartidos documentados
- Sistema visual especificado

### Tokens creados
- Colors: 12 variables (Light + Dark)
- Typography: 6 escalas
- Spacing: 7 valores
- Radii: 5 valores

### Componentes generados
- Button (3 variantes × 3 tamaños)
- Input (default, error, disabled)
- Card (slot-ready)
- Navigation (responsive)

### Pantallas
- Home/01 - Landing (desktop)
- Home/02 - Servicios (desktop)
- Booking/01 - Selección (mobile)

### Siguiente paso para diseño
1. Revisar el diagrama de arquitectura para entender los flujos
2. Revisar tokens y ajustar paleta si es necesario
3. Refinar componentes: detalle visual, micro-interacciones
4. Convertir frames slot-* a slots nativos (clic derecho → Convert to slot)
5. Crear casos de uso y edge cases adicionales
6. Publicar librería para el equipo
```

## Mapeo de elementos HTML → Figma

| HTML/React | Figma |
|---|---|
| `<div>` con flex/grid | Frame con Auto Layout |
| `<button>` | Component "Button" |
| `<input>`, `<textarea>` | Component "Input" |
| `<img>` | Rectangle con Image Fill (placeholder) |
| `<nav>`, `<header>` | Frame "Navigation" |
| `<ul>/<li>` | Frame con Auto Layout vertical |
| `<table>` | Frame con grid manual o Auto Layout |
| `<h1>`-`<h6>` | Text con estilo de typography token |
| `<p>`, `<span>` | Text con estilo body |
| `<a>` | Text con color link (documentar interacción) |
| `{children}`, `<slot>` | Frame slot-ready (prefijo `slot-`) |
| Condicional `{show && ...}` | BOOLEAN property |
| Props string | TEXT property |
| Props enum (size, variant) | VARIANT en component set |

## Errores a evitar

- **CRÍTICO: `resize()` sobreescribe `primaryAxisSizingMode` a "FIXED".**
  Si necesitas que un frame hug su contenido (AUTO), NUNCA uses `resize()`.
  En su lugar, usa solo `counterAxisSizingMode = "FIXED"` + un resize del ancho,
  o setea `primaryAxisSizingMode = "AUTO"` DESPUÉS de resize.
  Ejemplo para VERTICAL layout: `frame.resize(327, 1); frame.primaryAxisSizingMode = "AUTO";`
- No crear tokens duplicados si ya existen en el archivo
- No hardcodear colores si hay variables disponibles
- No crear componentes sin Auto Layout
- No dejar pantallas sin sección contenedora
- No olvidar `loadFontAsync` antes de crear textos
- No usar APIs sync (`getNodeById`) — siempre async
- No olvidar `blendMode: "NORMAL"` en shadows
- No setear `layoutSizingHorizontal = "FILL"` antes de `appendChild`
- No crear frames con `primaryAxisSizingMode: "AUTO"` sin contenido (colapsan)
- No sobrecargar una sola llamada a `figma_execute` — dividir en pasos

## Ejemplos de uso

- "Migra este HTML que generamos a Figma con su design system"
- "Convierte este artifact React en componentes de Figma"
- "Toma este prototipo y pásalo a Figma para que diseño lo retome"
- "Genera el DS en Figma a partir de este código Tailwind"
- "Lleva estos flujos de la app a Figma con componentes editables"
