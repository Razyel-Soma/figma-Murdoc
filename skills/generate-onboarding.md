# generate-onboarding

Skill para generar flujos de onboarding mobile completos en Figma.

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Pasos

### Paso 1 — Reconocimiento
- figma_get_variables → colores, tipografías, espaciados
- figma_search_components → botones, inputs, cards, nav
- Reportar al usuario antes de continuar

### Paso 2 — Sección contenedora
- Crear sección "Onboarding" en el canvas
- 4 frames dentro, izquierda a derecha, 80px separación

### Paso 3 — Pantalla 01: Bienvenida (375x812)
Frame: "Onboarding/01 - Bienvenida"
- Logo/ilustración centrada (40% superior)
- Título heading-xl
- Subtítulo body-md
- Botón CTA "Empezar" ancho completo (bottom)
- Link "Ya tengo cuenta"

### Paso 4 — Pantalla 02: Propuesta de valor (375x812)
Frame: "Onboarding/02 - Propuesta de valor"
- Indicador progreso 1/3
- Título de sección
- 3 items: icono 24x24 + título + descripción 2 líneas
- Botón "Continuar" + ghost "Saltar"

### Paso 5 — Pantalla 03: Registro (375x812)
Frame: "Onboarding/03 - Registro"
- Indicador progreso 2/3
- Título "Crea tu cuenta"
- Inputs: nombre, email, contraseña (con toggle)
- Checkbox términos
- Botón "Crear cuenta"
- Link "¿Ya tienes cuenta?"

### Paso 6 — Pantalla 04: Confirmación (375x812)
Frame: "Onboarding/04 - Confirmación"
- Icono éxito centrado (30%)
- Título "¡Listo!"
- Descripción siguiente paso
- Botón "Ir al inicio"

### Paso 7 — Verificación
- Screenshot de cada frame
- Verificar variables y nombres de capas
- Reportar resumen

## Si falta un componente
1. Notifica al usuario
2. Crea versión básica con formas nativas y variables disponibles
3. Prefija con _temp/ para identificación
