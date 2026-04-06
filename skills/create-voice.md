# create-voice

Skill para generar especificaciones de accesibilidad para screen readers (VoiceOver, TalkBack, ARIA) a partir de diseños UI en Figma. Analiza las pantallas, identifica elementos interactivos, y genera anotaciones con roles, labels, hints y orden de lectura.

Inspirado en el trabajo de Ian Guisard (Uber) para cerrar el gap entre diseño visual y experiencia de screen reader.

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Cuando usar este skill
- Cuando se prepara un diseño para implementación accesible
- Cuando se necesita documentar el comportamiento de screen readers
- Cuando el equipo de QA necesita specs para testing de accesibilidad
- Cuando se quiere auditar la accesibilidad de navegación de una pantalla
- Antes de un handoff donde la accesibilidad es crítica

## Parámetros disponibles
- `plataforma`: ios · android · web · todas (default: todas)
- `alcance`: pantalla-actual · flujo-completo · componente (default: pantalla-actual)
- `nivel`: basico · detallado (default: detallado)

## Conceptos clave

### Screen reader APIs por plataforma

| Concepto | VoiceOver (iOS) | TalkBack (Android) | Web (ARIA) |
|---|---|---|---|
| Nombre del elemento | `accessibilityLabel` | `contentDescription` | `aria-label` |
| Tipo/rol | `accessibilityTraits` | `roleDescription` | `role` |
| Hint/acción | `accessibilityHint` | `accessibilityAction` | `aria-describedby` |
| Estado | `accessibilityValue` | `stateDescription` | `aria-checked`, `aria-expanded` |
| Orden de lectura | `accessibilityElements` | `traversalOrder` | `tabindex` + DOM order |
| Grupo | `accessibilityContainer` | `importantForAccessibility` | `role="group"` + `aria-labelledby` |
| Ocultar | `accessibilityElementsHidden` | `importantForAccessibility="no"` | `aria-hidden="true"` |

## Pasos de ejecución

### Paso 1 — Analizar la pantalla

```
- figma_get_selection o pedir al usuario que indique qué pantalla analizar
- figma_execute (timeout: 20000) → recorrer el árbol de nodos:
  - Identificar elementos interactivos: botones, inputs, links, switches, tabs
  - Identificar elementos informativos: headings, labels, badges, iconos con significado
  - Identificar elementos decorativos: imágenes de fondo, separadores, iconos decorativos
  - Detectar agrupaciones lógicas: formularios, cards, secciones
  - Extraer textos visibles de cada elemento
  - Determinar orden de lectura visual (top→bottom, left→right)
```

**Patrón de código para análisis:**
```javascript
// ✅ timeout: 20000 — análisis de pantalla completa
const frame = await figma.getNodeByIdAsync("FRAME_ID");
const elements = [];

function analyze(node, depth = 0) {
  const el = {
    id: node.id,
    name: node.name,
    type: node.type,
    x: Math.round(node.absoluteTransform[0][2]),
    y: Math.round(node.absoluteTransform[1][2]),
    w: Math.round(node.width),
    h: Math.round(node.height),
    visible: node.visible,
    text: node.type === 'TEXT' ? node.characters : null,
    isInteractive: false,
    category: 'decorative'
  };

  // Detectar elementos interactivos
  const nameLower = node.name.toLowerCase();
  if (nameLower.includes('button') || nameLower.includes('btn') || nameLower.includes('cta')) {
    el.isInteractive = true;
    el.category = 'action';
  } else if (nameLower.includes('input') || nameLower.includes('field') || nameLower.includes('search')) {
    el.isInteractive = true;
    el.category = 'input';
  } else if (nameLower.includes('link') || nameLower.includes('tab') || nameLower.includes('nav')) {
    el.isInteractive = true;
    el.category = 'navigation';
  } else if (nameLower.includes('switch') || nameLower.includes('toggle') || nameLower.includes('checkbox')) {
    el.isInteractive = true;
    el.category = 'control';
  } else if (nameLower.includes('heading') || nameLower.includes('title') || nameLower.includes('h1') || nameLower.includes('h2')) {
    el.category = 'heading';
  } else if (node.type === 'TEXT') {
    el.category = 'text';
  } else if (nameLower.includes('icon') && !nameLower.includes('decorat')) {
    el.category = 'icon';
  }

  if (el.category !== 'decorative' || el.isInteractive) {
    elements.push(el);
  }

  if ('children' in node) {
    for (const child of node.children) {
      if (child.visible) analyze(child, depth + 1);
    }
  }
}

analyze(frame);

// Ordenar por posición de lectura (top-to-bottom, left-to-right)
elements.sort((a, b) => a.y - b.y || a.x - b.x);

return { count: elements.length, elements: elements.slice(0, 40) };
```

### Paso 2 — Generar spec de screen reader

Para cada elemento significativo, generar:

```
## Spec de Screen Reader — [Nombre de pantalla]

### Orden de lectura
1. [Header] "Pantalla de perfil" — Heading, nivel 1
2. [Avatar] "Foto de perfil de Juan" — Imagen
3. [Name] "Juan García" — Texto
4. [Edit Button] "Editar perfil" — Botón
...

### Elementos interactivos

#### 1. Botón "Editar perfil"
| Plataforma | Propiedad | Valor |
|---|---|---|
| VoiceOver | accessibilityLabel | "Editar perfil" |
| VoiceOver | accessibilityTraits | .button |
| VoiceOver | accessibilityHint | "Abre el editor de perfil" |
| TalkBack | contentDescription | "Editar perfil" |
| TalkBack | className | "android.widget.Button" |
| ARIA | role | "button" |
| ARIA | aria-label | "Editar perfil" |

#### 2. Input "Email"
| Plataforma | Propiedad | Valor |
|---|---|---|
| VoiceOver | accessibilityLabel | "Email" |
| VoiceOver | accessibilityTraits | .none (UITextField maneja esto) |
| VoiceOver | accessibilityValue | "juan@email.com" |
| VoiceOver | accessibilityHint | "Ingresa tu dirección de email" |
| TalkBack | contentDescription | "Email" |
| TalkBack | hint | "Ingresa tu dirección de email" |
| ARIA | role | "textbox" |
| ARIA | aria-label | "Email" |
| ARIA | aria-describedby | "[id del hint]" |
| ARIA | aria-required | "true" (si aplica) |

#### 3. Switch "Notificaciones"
| Plataforma | Propiedad | Valor |
|---|---|---|
| VoiceOver | accessibilityLabel | "Notificaciones push" |
| VoiceOver | accessibilityTraits | .button |
| VoiceOver | accessibilityValue | "Activado" / "Desactivado" |
| TalkBack | contentDescription | "Notificaciones push" |
| TalkBack | stateDescription | "Activado" / "Desactivado" |
| ARIA | role | "switch" |
| ARIA | aria-label | "Notificaciones push" |
| ARIA | aria-checked | "true" / "false" |
```

### Paso 3 — Identificar agrupaciones y containers

```
- Detectar grupos lógicos (formularios, secciones de cards, tabs)
- Para cada grupo:
  - VoiceOver: accessibilityContainer = true
  - TalkBack: importantForAccessibility = "yes" con contentDescription del grupo
  - ARIA: role="group" o role="region" + aria-labelledby
```

### Paso 4 — Detectar problemas de accesibilidad

```
- Elementos interactivos sin texto visible → necesitan aria-label explícito
- Iconos solos como botones → necesitan accessibilityLabel
- Imágenes sin descripción → necesitan alt text
- Grupos sin label → necesitan aria-labelledby
- Touch targets < 44x44px → advertencia de tamaño
- Contraste insuficiente → flag para revisión (usar figma_lint_design)
- Elementos decorativos que no deberían ser leídos → marcar como aria-hidden
```

### Paso 5 — Anotar en Figma

> ⚠️ `figma_set_annotations` depende del Desktop Bridge plugin.
> Si no funciona, usar `figma_execute` con `node.setPluginData()` como fallback.

```
- figma_set_annotations → para cada elemento interactivo:
  - Label con la spec de screen reader
  - Categoría: "Accessibility"
  - Propiedades pinneadas relevantes (width, height para touch targets)
```

**Ejemplo de anotación en markdown:**
```markdown
### Screen Reader Spec
**VoiceOver:** "Editar perfil", Button, "Abre el editor de perfil"
**TalkBack:** "Editar perfil", android.widget.Button
**ARIA:** role="button", aria-label="Editar perfil"
**Orden de lectura:** #4
```

### Paso 6 — Generar documento de spec completo

Además de las anotaciones en Figma, generar un documento resumen:

```
## Voice Spec — [Pantalla]
Fecha: [fecha]
Plataformas: iOS, Android, Web

### Resumen
- Elementos totales: X
- Interactivos: X (botones, inputs, links, controles)
- Informativos: X (headings, textos, imágenes)
- Decorativos (ocultar): X
- Issues de accesibilidad: X

### Orden de lectura completo
[Lista numerada de todos los elementos en orden]

### Specs por elemento
[Tablas detalladas por plataforma]

### Agrupaciones
[Containers y su configuración]

### Issues encontrados
[Lista priorizada de problemas]
```

## Mapeo de componentes comunes a roles

| Componente Figma | VoiceOver Trait | TalkBack Role | ARIA Role |
|---|---|---|---|
| Button | .button | Button | button |
| Link/TextLink | .link | — | link |
| Input/TextField | — (UITextField) | EditText | textbox |
| Switch/Toggle | .button | Switch | switch |
| Checkbox | .button | CheckBox | checkbox |
| Radio | .button | RadioButton | radio |
| Tab | .button + .selected | Tab | tab |
| Slider | .adjustable | SeekBar | slider |
| Image (informativa) | .image | ImageView | img |
| Image (decorativa) | .none + hidden | importantForAccessibility="no" | aria-hidden="true" |
| Heading | .header | heading | heading (h1-h6) |
| Alert/Toast | — | — | alert / status |
| Dialog/Modal | — | — | dialog |
| Nav | — | — | navigation |
| List | — | — | list |

## Ejemplos de uso
- "Genera la spec de screen reader para esta pantalla de login"
- "¿Qué labels necesitan mis botones para VoiceOver?"
- "Audita la accesibilidad de navegación de este flujo"
- "Anota todos los elementos con sus roles ARIA"
- "Genera la spec de TalkBack para la pantalla de checkout"
- "¿Cuál debería ser el orden de lectura de esta pantalla?"
