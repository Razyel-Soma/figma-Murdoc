# apply-design-system

Skill para conectar diseños existentes al sistema de diseño: reemplaza valores hardcodeados por variables, reconecta componentes desconectados y genera librerías de componentes desde el codebase.

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Cuando usar este skill
- Cuando hay diseños heredados que no usan el DS
- Cuando se han desconectado componentes del sistema de diseño
- Cuando se quiere migrar un archivo antiguo al DS actual
- Cuando se quiere generar una librería Figma desde componentes de código

## Modos de uso
- `conectar`: conecta diseños existentes al DS (default)
- `migrar`: migra valores hardcodeados a variables del DS
- `generar-libreria`: crea componentes Figma desde código

## Pasos de ejecución

### MODO: conectar

#### Paso 1 — Analizar el archivo
```
- figma_get_design_system_summary → componentes disponibles en el DS
- figma_get_file_data → árbol del archivo a conectar
- Identificar instancias de componentes desconectados
```

#### Paso 2 — Reconectar componentes
Para cada componente desconectado:
```
- figma_search_components → buscar el componente equivalente en el DS
- Si se encuentra: figma_instantiate_component para reemplazar
- Si no se encuentra: notificar al usuario y marcar con _pendiente/
- figma_capture_screenshot para verificar que el reemplazo es correcto
```

#### Paso 3 — Reportar
- Componentes reconectados: X de Y
- Componentes sin equivalente en el DS: lista con nombres

---

### MODO: migrar

#### Paso 1 — Escanear valores hardcodeados
```
- figma_get_variables → cargar todas las variables del DS
- figma_execute → escanear todos los nodos en busca de:
  - Colores con equivalente en variables de color
  - Espaciados con equivalente en variables de spacing
  - Radios con equivalente en variables de border-radius
```

#### Paso 2 — Proponer mapeo
Mostrar al usuario la propuesta de mapeo antes de aplicar:
```
Color #007AFF → variable color/primary ✓
Color #F5F5F5 → variable color/background-secondary ✓
Color #FF3B30 → sin equivalente en DS ✗ (crear variable?)
```

#### Paso 3 — Aplicar con confirmación
Solo aplicar los mapeos confirmados por el usuario:
```
- figma_execute → reemplazar valores hardcodeados por referencias a variables
- figma_capture_screenshot → verificar resultado
```

---

### MODO: generar-libreria

#### Paso 1 — Analizar el codebase
El usuario provee información de sus componentes de código:
- Nombre del componente
- Props disponibles
- Variantes/estados

#### Paso 2 — Crear componentes en Figma
Para cada componente del codebase:
```
- figma_execute → crear componente base con Auto Layout
- figma_add_component_property → añadir propiedades que reflejen las props del código
- figma_arrange_component_set → organizar variantes en grid
- figma_set_description → documentar el componente con nombre y props
```

#### Paso 3 — Verificar y publicar
```
- figma_capture_screenshot de cada componente creado
- Reportar resumen de la librería generada
- Recomendar al usuario publicar la librería desde Figma
```

## Ejemplos de uso
- "Conecta este archivo antiguo al nuevo sistema de diseño"
- "Reemplaza todos los colores hardcodeados por variables del DS"
- "Genera los componentes de Figma desde nuestros componentes de React"
- "Migra este archivo de diseño al sistema de diseño actual"
