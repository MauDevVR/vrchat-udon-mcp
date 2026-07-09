# VRChat Udon MCP

Servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io) que expone el repositorio [agent-skills-vrc-udon](https://github.com/niaka3dayo/agent-skills-vrc-udon) como interfaz MCP para desarrollo UdonSharp en VRChat.

**El repositorio `agent-skills-vrc-udon` es la Ãºnica fuente de verdad.** Este MCP no contiene documentaciÃ³n hardcodeada: indexa, busca y valida dinÃ¡micamente todo el contenido del repositorio.

## CaracterÃ­sticas

- **18 herramientas MCP** impulsadas por el repositorio
- **Recursos MCP** dinÃ¡micos (skills, rules, cheatsheets, templates, SDK matrix)
- IndexaciÃ³n recursiva de `skills/`, `rules/`, `references/`, `templates/`, `hooks/`, `assets/`
- BÃºsqueda MiniSearch con ranking: heading > tÃ­tulo > cuerpo
- ValidaciÃ³n de cÃ³digo desde reglas del repositorio (tablas + hooks)
- File watcher con reconstrucciÃ³n automÃ¡tica del Ã­ndice
- SincronizaciÃ³n git del repositorio remoto
- TypeScript estricto, Vitest, ESLint, Prettier

## Requisitos

- **Node.js** 22+
- **pnpm** 9+
- **git** (para sincronizar documentaciÃ³n)

## InstalaciÃ³n

```bash
git clone https://github.com/MauDevVR/vrchat-udon-mcp.git
cd vrchat-udon-mcp
pnpm install
pnpm update-docs    # Clona/actualiza agent-skills-vrc-udon
pnpm build-index    # Construye el Ã­ndice de bÃºsqueda
pnpm build
```

## ConfiguraciÃ³n

Edita `config.json`:

```json
{
  "repository": {
    "url": "https://github.com/niaka3dayo/agent-skills-vrc-udon",
    "path": "./agent-skills-vrc-udon",
    "branch": "main"
  },
  "sdkVersion": "3.10.4",
  "language": "es",
  "watch": true,
  "indexPath": "./data/indexes",
  "search": {
    "fuzzy": 0.2,
    "headingWeight": 3.0,
    "titleWeight": 2.5,
    "exampleWeight": 1.5,
    "ruleWeight": 2.0,
    "skillWeight": 2.5,
    "cheatsheetWeight": 2.5,
    "maxResults": 20
  }
}
```

| Campo | DescripciÃ³n |
|-------|-------------|
| `repository.url` | URL del repositorio fuente |
| `repository.path` | Ruta local del repositorio clonado |
| `repository.branch` | Rama a sincronizar |
| `sdkVersion` | VersiÃ³n SDK por defecto para filtros |
| `watch` | Reconstruir Ã­ndice al detectar cambios en el repo |
| `indexPath` | Carpeta del Ã­ndice persistido |

TambiÃ©n puedes usar la variable de entorno `UDON_MCP_CONFIG` para apuntar a otro archivo de configuraciÃ³n.

## SincronizaciÃ³n del repositorio

```bash
# Clonar o actualizar agent-skills-vrc-udon y reconstruir Ã­ndice
pnpm update-docs

# Solo reconstruir Ã­ndice (sin git pull)
pnpm build-index
```

El repositorio se clona en `./agent-skills-vrc-udon` (configurable). Los archivos nuevos se indexan automÃ¡ticamente sin cambios de cÃ³digo.

## Uso

```bash
pnpm start      # Inicia el servidor MCP (stdio)
pnpm dev        # Modo desarrollo con recarga
pnpm test       # Ejecuta tests Vitest
```

## IntegraciÃ³n con IDEs

> **No uses rutas absolutas** como `C:\Users\tu-usuario\...` en la configuraciÃ³n MCP.
> No son portables entre equipos, exponen tu nombre de usuario y dejan de funcionar si mueves el proyecto.
> Prefiere rutas relativas al workspace, `npx` desde GitHub, o instalar el paquete globalmente.

Antes de conectar el MCP, ejecuta al menos una vez:

```bash
pnpm update-docs && pnpm build-index && pnpm build
```

### OpciÃ³n A â€“ `docs/mcp-config.example.json` en este repositorio (recomendada al desarrollar el MCP)

Si tu workspace es la raÃ­z de este repo, usa `docs/mcp-config.example.json` como plantilla y cÃ³piala a la configuraciÃ³n MCP de tu IDE:

```json
{
  "mcpServers": {
    "vrchat-udon": {
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"]
    }
  }
}
```

TambiÃ©n puedes usar `"./dist/index.js"`; Cursor resuelve rutas relativas al workspace.

### OpciÃ³n B â€” `npx` desde GitHub (sin clonar manualmente)

No requiere rutas locales. `npx` descarga el repo, ejecuta `prepare` (compila TypeScript) y lanza el binario:

```json
{
  "mcpServers": {
    "vrchat-udon": {
      "command": "npx",
      "args": ["-y", "github:MauDevVR/vrchat-udon-mcp"]
    }
  }
}
```

Con pnpm: `pnpm dlx github:MauDevVR/vrchat-udon-mcp` (equivalente en terminal).

**Nota:** La primera ejecuciÃ³n compila el proyecto y puede tardar. AÃºn necesitas documentaciÃ³n indexada; la primera vez ejecuta `npx -y github:MauDevVR/vrchat-udon-mcp` no clona `agent-skills-vrc-udon` automÃ¡ticamente â€” hazlo con `pnpm update-docs` si clonaste el repo, o configura `UDON_MCP_CONFIG` apuntando a un `config.json` con el repo de docs ya sincronizado.

### OpciÃ³n C â€” InstalaciÃ³n global tras clonar en cualquier carpeta

```bash
git clone https://github.com/MauDevVR/vrchat-udon-mcp.git
cd vrchat-udon-mcp
pnpm install
pnpm update-docs
pnpm build-index
pnpm build
pnpm link --global
```

ConfiguraciÃ³n MCP (Cursor o Claude Desktop):

```json
{
  "mcpServers": {
    "vrchat-udon": {
      "command": "vrchat-udon-mcp"
    }
  }
}
```

Alternativa sin link global: `"command": "pnpm", "args": ["exec", "vrchat-udon-mcp"]` desde el directorio del repo.

### OpciÃ³n D â€” Submodule en tu proyecto VRChat

AÃ±ade el MCP como submÃ³dulo y usa una ruta relativa al workspace de tu mundo:

```bash
git submodule add https://github.com/MauDevVR/vrchat-udon-mcp.git tools/vrchat-udon-mcp
cd tools/vrchat-udon-mcp && pnpm install && pnpm update-docs && pnpm build-index && pnpm build
```

En la configuraciÃ³n MCP de tu proyecto VRChat (segÃºn la documentaciÃ³n de tu IDE):

```json
{
  "mcpServers": {
    "vrchat-udon": {
      "command": "node",
      "args": ["${workspaceFolder}/tools/vrchat-udon-mcp/dist/index.js"]
    }
  }
}
```

### OpciÃ³n E â€” Dependencia git en tu proyecto

```bash
pnpm add github:MauDevVR/vrchat-udon-mcp
```

```json
{
  "mcpServers": {
    "vrchat-udon": {
      "command": "npx",
      "args": ["vrchat-udon-mcp"]
    }
  }
}
```

### Cursor (configuraciÃ³n manual en Settings)

En **Cursor Settings â†’ MCP**, puedes pegar cualquiera de las opciones anteriores en lugar de rutas absolutas.

### Claude Desktop

En `%APPDATA%\Claude\claude_desktop_config.json` (Windows) o `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS), usa las mismas opciones B, C o E. Para desarrollo local del repo, OpciÃ³n A con ruta relativa al clone.

### ChatGPT Desktop

Configura un servidor MCP stdio con cualquiera de las opciones anteriores (evita rutas absolutas con tu usuario de Windows).

## Herramientas MCP

| Herramienta | DescripciÃ³n |
|-------------|-------------|
| `search_documentation` | BÃºsqueda keyword/fuzzy en toda la documentaciÃ³n |
| `explain_topic` | ExplicaciÃ³n con citas (path, heading, lÃ­neas) |
| `list_skills` | Descubre skills automÃ¡ticamente |
| `read_skill` | Lee SKILL.md con metadata, rules, references, templates |
| `list_rules` | Lista reglas UdonSharp |
| `read_rule` | Lee regla con constraints y ejemplos |
| `search_reference` | Busca en references/ |
| `list_templates` | Lista plantillas .cs |
| `get_template` | Obtiene plantilla con cÃ³digo completo |
| `validate_code` | Valida cÃ³digo con reglas del repositorio |
| `explain_validation` | Explica fallo citando la regla fuente |
| `sdk_matrix` | Matriz de versiones SDK desde templates/AGENTS.md |
| `search_sdk_feature` | Busca features (NetworkCallable, PlayerData, etc.) |
| `search_constraints` | Busca restricciones (List, Coroutine, etc.) |
| `search_networking` | Busca temas de networking y sync |
| `search_examples` | Busca ejemplos de cÃ³digo |
| `search_best_practice` | Busca patrones recomendados |
| `search_antipattern` | Busca anti-patrones |

## Recursos MCP

- `udon://skills/{id}` â€” SKILL.md de cada skill
- `udon://rules/{id}` â€” Archivos de reglas
- `udon://sdk/matrix` â€” Matriz de versiones SDK
- `udon://templates/index` â€” Ãndice de plantillas
- `udon://cheatsheet/{id}` â€” CHEATSHEET.md por skill

## Arquitectura

```
agent-skills-vrc-udon/     â† Fuente de verdad (git clone)
        â†“
KnowledgeParser            â† Indexa recursivamente todos los archivos
        â†“
DocsRepository             â† Persiste Ã­ndice en data/indexes/
        â†“
SearchEngine (MiniSearch)  â† BÃºsqueda con ranking ponderado
RuleParser                 â† Reglas desde hooks/ y tablas rules/
        â†“
MCP Tools (18)             â† Interfaz para el agente IA
```

## Scripts

| Script | DescripciÃ³n |
|--------|-------------|
| `pnpm build` | Compila TypeScript |
| `pnpm start` | Inicia servidor MCP |
| `pnpm test` | Tests Vitest |
| `pnpm update-docs` | git clone/pull del repositorio fuente |
| `pnpm build-index` | Reconstruye Ã­ndice de bÃºsqueda |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

## CrÃ©ditos

- DocumentaciÃ³n y skills: [niaka3dayo/agent-skills-vrc-udon](https://github.com/niaka3dayo/agent-skills-vrc-udon)
- Servidor MCP: [MauDevVR/vrchat-udon-mcp](https://github.com/MauDevVR/vrchat-udon-mcp)

## Licencia

MIT
