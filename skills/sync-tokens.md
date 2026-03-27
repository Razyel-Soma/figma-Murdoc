# sync-tokens

Skill para exportar las variables de Figma como tokens de código: CSS custom properties, Tailwind config, JSON o Sass variables. Mantiene sincronizados el sistema de diseño y el codebase.

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Cuando usar este skill
- Cuando development necesita los tokens actualizados del DS
- Cuando hay cambios en variables de Figma que deben reflejarse en código
- Para hacer el setup inicial de tokens en un proyecto nuevo
- Para detectar drift entre los tokens de Figma y los del codebase

## Parámetros disponibles
- `formato`: css · tailwind · json · sass (default: css)
- `colecciones`: todas · [nombre-específico] (default: todas)
- `modo`: light · dark · todos (default: todos)

## Pasos de ejecución

### Paso 1 — Leer todas las variables
```
- figma_get_variables con format='full' → obtener todas las colecciones, modos y valores
- Mostrar al usuario un resumen: X variables en Y colecciones con Z modos
- Confirmar qué colecciones y modos exportar
```

### Paso 2 — Transformar según formato

#### CSS custom properties
```css
:root {
  /* Colores - modo light */
  --color-primary: #007AFF;
  --color-primary-hover: #0056CC;

  /* Tipografía */
  --font-size-base: 16px;
  --font-size-lg: 20px;

  /* Espaciado */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
}

[data-theme="dark"] {
  --color-primary: #4DA3FF;
}
```

#### Tailwind config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
      }
    }
  }
}
```

#### JSON (W3C Design Tokens format)
```json
{
  "color": {
    "primary": { "$value": "#007AFF", "$type": "color" },
    "primary-hover": { "$value": "#0056CC", "$type": "color" }
  },
  "fontSize": {
    "base": { "$value": "16px", "$type": "dimension" }
  }
}
```

#### Sass variables
```scss
// Colores
$color-primary: #007AFF;
$color-primary-hover: #0056CC;

// Tipografía
$font-size-base: 16px;
```

### Paso 3 — Detectar drift (opcional)
Si el usuario tiene un archivo de tokens existente:
```
- Comparar variables de Figma con tokens actuales del codebase
- Listar variables nuevas (en Figma, no en código)
- Listar variables eliminadas (en código, no en Figma)
- Listar variables con valores distintos
```

### Paso 4 — Entregar los tokens
- Mostrar el código generado en la conversación
- Indicar qué archivo del proyecto debe actualizarse
- Si hay drift, mostrar primero el diff y pedir confirmación

## Convenciones de naming en la exportación
- Usar kebab-case para todos los nombres
- Prefijo por tipo: color-, font-, spacing-, radius-, shadow-
- Mantener la jerarquía de las colecciones de Figma: color-brand-primary

## Ejemplos de uso
- "Exporta todos los tokens como CSS variables"
- "Dame el config de Tailwind con los colores del DS"
- "Genera los tokens en formato JSON para Style Dictionary"
- "¿Hay diferencias entre los tokens de Figma y los de nuestro código?"
