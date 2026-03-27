# prepare-handoff

Skill para preparar diseños de Figma para entrega al equipo de desarrollo. Verifica calidad, añade anotaciones, nombra capas correctamente y marca frames como "Ready for dev".

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Cuando usar este skill
- Cuando el diseño está listo y se va a entregar a desarrollo
- Cuando se quiere verificar la calidad antes del handoff
- Cuando hay que añadir contexto técnico al diseño

## Pasos de ejecución

### Paso 1 — Identificar qué preparar
Preguntar al usuario qué frames o secciones va a entregar.
Obtener los nodeIds correspondientes.

### Paso 2 — Auditoría de nomenclatura
```
- figma_get_file_data → obtener árbol de capas
- Detectar capas con nombres por defecto: "Frame N", "Rectangle N", "Group N", "Layer N"
- Renombrar automáticamente con figma_rename_node usando nombres semánticos
- Reportar al usuario qué capas se renombraron
```

### Paso 3 — Verificación de tokens
```
- figma_get_variables → cargar todas las variables disponibles
- figma_execute → escanear los frames seleccionados en busca de:
  - Colores hardcodeados que tengan variable equivalente
  - Fuentes no conectadas al sistema de diseño
  - Espaciados hardcodeados con variable equivalente
- Reportar lista de valores hardcodeados encontrados
- Preguntar al usuario si quiere corregirlos automáticamente
```

### Paso 4 — Añadir anotaciones clave
Para cada frame a entregar, añadir anotaciones en elementos críticos:
```
- figma_set_annotations → añadir notas en:
  - Interacciones no obvias (gestos, transiciones)
  - Comportamientos responsivos
  - Contenido dinámico o condicional
  - Restricciones de accesibilidad importantes
```

### Paso 5 — Verificación de accesibilidad básica
```
- figma_lint_design con reglas ['wcag'] → detectar:
  - Contraste insuficiente
  - Textos menores a 12px
  - Touch targets menores a 44x44px
- Reportar findings al usuario con severidad
```

### Paso 6 — Generar resumen de handoff
Crear un comentario en Figma con el resumen:
```
- figma_post_comment → añadir nota con:
  - Fecha de handoff
  - Lista de frames incluidos
  - Componentes usados del DS
  - Tokens aplicados
  - Issues de accesibilidad pendientes (si los hay)
  - Notas especiales del diseñador
```

### Paso 7 — Captura final
```
- figma_capture_screenshot de cada frame preparado
- Confirmar al usuario que el handoff está listo
```

## Resumen que entrega al usuario
Al terminar, generar un documento con:
- Frames listos para desarrollo
- Lista de componentes usados
- Tokens aplicados por frame
- Issues encontrados y si se corrigieron
- Enlace al archivo de Figma

## Ejemplos de uso
- "Prepara el flujo de onboarding para entregarlo a los devs"
- "Haz el handoff de las pantallas de checkout"
- "Verifica y prepara todos los frames de la sección de perfil"
