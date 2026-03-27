# FAQ — Figma Murdoc

Preguntas frecuentes para el equipo antes de empezar a usar Figma Murdoc.

---

## Conceptos generales

**¿Qué es Figma Murdoc exactamente?**
Es un servidor MCP (Model Context Protocol) que conecta Claude con Figma Desktop. Permite darle instrucciones a Claude en lenguaje natural y que las ejecute directamente sobre el canvas de Figma: crea pantallas, documenta componentes, prepara handoffs y audita sistemas de diseño usando tu propio sistema de diseño como fuente de verdad.

**¿Qué es un skill?**
Un skill es un archivo de instrucciones en markdown que le dice a Claude cómo ejecutar un workflow específico paso a paso. En lugar de explicarle cada vez qué hacer, el skill empaqueta ese conocimiento de forma reutilizable. Es como una receta: defines los pasos una sola vez y Claude los sigue cada vez que se lo pides.

**¿Necesito saber programar para usarlo?**
No. La interacción es en lenguaje natural desde Claude Desktop. El único momento técnico es la instalación inicial, que está documentada en el README con comandos copiables.

---

## Diferencias con el MCP oficial de Figma

**¿En qué se diferencia del MCP oficial que lanzó Figma?**
El MCP oficial de Figma está pensado principalmente para desarrolladores y flujos de código: genera código desde diseños, conecta con Cursor, VS Code o Claude Code, y está optimizado para design-to-code. Figma Murdoc está pensado para diseñadores: genera pantallas, documenta componentes, prepara handoffs y audita sistemas de diseño — todo desde Claude Desktop, sin necesidad de un IDE.

| | MCP oficial Figma | Figma Murdoc |
|---|---|---|
| Pensado para | Desarrolladores | Diseñadores |
| Cliente principal | Claude Code, Cursor, VS Code | Claude Desktop |
| Skills | Genéricos de Figma | Específicos de tu equipo |
| Customización | Limitada | Total — son tus archivos .md |
| Requiere Enterprise | Para variables API | No |
| Coste | Gratuito en beta, luego de pago | Gratuito y open source |

**¿Puedo usar los dos a la vez?**
Sí. En la instalación actual ya corren en paralelo: el MCP oficial como extensión de Claude y Figma Murdoc como servidor propio. No se pisan.

---

## Personalización

**¿Cómo adapto los skills a nuestro flujo de trabajo?**
Los skills son archivos `.md` en la carpeta `/skills/`. Los abres con cualquier editor de texto, editas las instrucciones y listo — sin recompilar ni reiniciar nada. Si tu equipo usa convenciones de nomenclatura distintas, si tienes componentes específicos o si el flujo de handoff tiene pasos propios, simplemente los describes en el markdown.

**¿Cómo añado un skill nuevo?**
Creas un archivo `.md` en la carpeta `/skills/` con esta estructura mínima:
```markdown
# nombre-del-skill

Descripción de qué hace.

## Prerequisito
Carga figma-use antes de ejecutar este skill.

## Cuando usar este skill
- Situación en la que aplica

## Pasos de ejecución
### Paso 1 — ...
### Paso 2 — ...
```

La próxima vez que preguntes `list_skills` en Claude Desktop, aparece automáticamente.

**¿Puedo tener skills diferentes para proyectos distintos?**
Sí. Puedes crear skills con prefijos de proyecto o mantener versiones distintas del servidor para clientes diferentes. Como son archivos de texto, también puedes versionarlos en Git y hacer branches por cliente.

**¿Puedo editar las instrucciones base del servidor?**
Sí, abre `figma-murdoc.md` en la raíz del repo, edita las reglas de diseño o convenciones, guarda y reinicia Claude Desktop.

---

## Compatibilidad técnica

**¿Puedo usarlo con otro LLM que no sea Claude?**
Técnicamente el servidor es compatible con cualquier cliente MCP — el protocolo es estándar. Cursor, VS Code con Copilot y otros clientes MCP pueden conectarse. Sin embargo, los skills están optimizados para Claude. Con otros modelos el servidor funciona pero los skills pueden dar resultados menos precisos.

**¿Funciona con Figma en el navegador?**
No. El plugin Figma Desktop Bridge solo funciona con la aplicación de escritorio de Figma. Es un requisito del Plugin API de Figma.

**¿Funciona en Windows?**
El servidor MCP funciona en cualquier sistema con Node.js. Con ajustes menores en las rutas de instalación, funciona en Windows.

**¿Qué pasa si Figma actualiza su API y algo deja de funcionar?**
Al ser un fork open source, podemos actualizar el repo base cuando salgan cambios. Los skills en markdown no dependen de versiones de API.

---

## Seguridad y privacidad

**¿Los datos de diseño salen de nuestro entorno?**
En modo local, la conexión es WebSocket en localhost. Los datos del canvas no salen de la máquina. Cuando Claude procesa una petición, sí envía el contexto a los servidores de Anthropic — igual que cualquier conversación de Claude Desktop.

**¿Puede Claude hacer cambios destructivos en Figma sin que me entere?**
Las instrucciones del servidor le piden confirmación antes de cualquier operación destructiva. Además, todos los cambios son reversibles con Cmd+Z en Figma.

**¿Puedo restringir qué archivos de Figma puede ver o modificar?**
El servidor accede al archivo que tengas abierto con el plugin activo. Si el plugin no está corriendo en un archivo, ese archivo no es accesible.

---

## Uso práctico

**¿Cuánto tiempo ahorra en la práctica?**
La reducción en tiempo de generación de pantallas es del 60-70% en la fase de scaffolding. El mayor ahorro está en tareas repetitivas: documentar componentes, preparar handoffs y exportar tokens — cada una puede pasar de 30-60 minutos a 2-5 minutos.

**¿Qué hago si Claude genera algo incorrecto en Figma?**
Cmd+Z en Figma deshace los cambios. El flujo de trabajo estándar incluye un screenshot de verificación después de cada acción para prevenir errores.

**¿Los skills funcionan con cualquier sistema de diseño?**
Sí. Los skills leen las variables y componentes del archivo activo en tiempo de ejecución. No tienen valores hardcodeados — todo viene del sistema de diseño que tengas en Figma.

**¿Necesito tener el archivo de Figma abierto mientras uso los skills?**
Sí. El plugin Figma Desktop Bridge tiene que estar activo en el archivo. Si cierras el plugin o cambias de archivo sin activarlo, las operaciones de escritura fallan y Claude te pedirá que lo reactives.
