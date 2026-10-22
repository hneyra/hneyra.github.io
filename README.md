# hneyra.github.io

CV online y portfolio de **Jorge H. Neyra-Araoz**, generado con [Jekyll](https://jekyllrb.com/) 4.4 y publicado en GitHub Pages mediante GitHub Actions.

- Bilingüe: inglés en `/` y español en `/es/`.
- Todo el contenido vive en `_data/`; no hace falta tocar HTML ni CSS para actualizarlo.
- Sin frameworks JavaScript, sin fuentes web externas y sin analítica. Funciona sin JavaScript.
- Tres temas de color (azul marino, terracota, grafito), cada uno en claro y oscuro. Por defecto sigue la preferencia del sistema y recuerda la elección del visitante.
- Versión imprimible y PDF descargable en ambos idiomas.

## Ejecutar en local

### 1. Requisitos

- **Ruby 4.0.6** (la versión está fijada en `.ruby-version`). En macOS:

  ```sh
  brew install rbenv ruby-build   # una sola vez
  rbenv install 4.0.6             # una sola vez
  rbenv local 4.0.6               # dentro de esta carpeta (lee .ruby-version)
  ```

  Con otra herramienta (asdf, chruby, mise) basta con instalar la versión de `.ruby-version`.
- **Bundler**, que viene con Ruby (`bundle -v` para comprobarlo).

### 2. Instalar dependencias

```sh
bundle install
```

### 3. Arrancar el servidor de desarrollo

```sh
bundle exec jekyll serve --livereload
```

Abre <http://localhost:4000/> (inglés) y <http://localhost:4000/es/> (español). La página se regenera y recarga sola al guardar cambios.

Para probar desde el móvil en la misma red Wi-Fi: `bundle exec jekyll serve --host 0.0.0.0` y abre `http://<IP-de-tu-ordenador>:4000/`.

> Los cambios en `_config.yml` no se recargan solos: detén el servidor (Ctrl+C) y vuelve a arrancarlo.

### 4. Compilar como en producción

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

El resultado queda en `_site/`. Para simular una URL de proyecto (`usuario.github.io/repositorio/`):

```sh
JEKYLL_ENV=production bundle exec jekyll build --baseurl /repositorio
```

### Problemas frecuentes

| Síntoma | Solución |
| --- | --- |
| `Could not find gem ...` | Ejecuta `bundle install`. |
| `Your Ruby version is X, but your Gemfile specified ...` o versión de Ruby distinta | Comprueba `ruby -v`; activa la versión de `.ruby-version` con tu gestor de versiones. |
| `Address already in use - bind(2) for 127.0.0.1:4000` | Ya hay otro servidor: ciérralo o usa `--port 4001`. |
| No se ven los cambios | Borra la caché: `bundle exec jekyll clean` y vuelve a arrancar. |

## Editar el contenido

| Qué | Dónde |
| --- | --- |
| Nombre, iniciales, email, foto, PDF y enlaces (LinkedIn, GitHub…) | `_data/profile.yml` |
| Textos en inglés: puesto, titular, presentación, perfil, contacto y todas las secciones | `_data/en.yml` |
| Lo mismo en español | `_data/es.yml` |
| Temas de color (colores de los puntos del selector) | `_data/themes.yml` (los colores completos están en `assets/css/main.scss`) |

Al cambiar algo en `en.yml`, haz el cambio equivalente en `es.yml`.

### Cabecera y perfil

En `en.yml` / `es.yml`:

- `role`: puesto (aparece sobre el nombre y en el título de la página).
- `headline`: propuesta de valor en una frase.
- `intro`: presentación de 2–3 frases.
- `description`: texto para buscadores y para la vista previa al compartir el enlace.
- `about.paragraphs`: resumen profesional. `about.facts`: datos clave (etiqueta + valor).
- `contact.text`: texto de la sección de contacto.

### Secciones

Las secciones se muestran en el orden de la lista `sections`. **Una sección sin elementos (`items: []`) no se muestra**, y tampoco su enlace en el menú. Cada sección tiene:

- `id`: ancla en la URL (`/#experience`).
- `title`: título visible.
- `nav`: texto en el menú superior (si se omite, la sección no aparece en el menú).
- `layout`: cómo se presenta:
  - `timeline`: experiencia (línea de tiempo).
  - `skills`: competencias en pocas líneas (`label` + `text`, tecnologías separadas por comas, de más a menos relevante).
  - `cards`: tarjetas (proyectos, certificaciones).
  - `list`: lista con título, organización y fechas (formación, docencia).
  - `compact`: lista breve con fecha (premios, concursos).
  - `pairs`: pares etiqueta/valor (idiomas, intereses).

### Añadir experiencia

Añade un elemento **al principio** de la sección `experience` (orden cronológico inverso):

```yaml
      - title: Puesto
        org: Empresa
        url: https://empresa.com          # opcional
        location: Ciudad, País            # opcional
        dates: ene. 2027 – actualidad
        text: Resumen de una línea.
        bullets:                          # opcional: responsabilidades y logros medibles
          - Logro concreto con resultado.
        tags: [Java, AWS]                 # opcional: tecnologías
```

Si un valor contiene comas dentro de una lista `[...]`, ponlo entre comillas: `["AWS (EKS, EC2)", Azure]`.

Para agrupar varios proyectos dentro de una misma empresa (como zAgile), usa `projects` en lugar de `text`/`bullets`. Cada proyecto se muestra como una tarjeta dentro de la experiencia:

```yaml
      - title: Senior Software Architect · Software Development Consultant
        org: zAgile, Inc.
        dates: abr. 2008 – dic. 2019
        projects:
          - title: Nombre del proyecto
            role: Puesto en ese proyecto
            client: Cliente                 # opcional
            dates: sep. 2015 – dic. 2019
            text: Qué hiciste.
            bullets: [...]                  # opcional
            tags: [Java, Spring Cloud]      # opcional
```

### Añadir proyectos

En la sección `projects` (hay un ejemplo comentado):

```yaml
    items:
      - title: Nombre del proyecto
        text: Qué hace y qué problema resuelve.
        tags: [Java, Spring Boot]
        repo: https://github.com/hneyra/repo     # opcional
        demo: https://demo.example.com          # opcional
        image: /assets/img/projects/captura.png # opcional, solo capturas reales
        image_alt: Descripción de la captura
```

### Añadir formación y certificaciones

- Formación: sección `education` (`title`, `org`, `url`, `location`, `dates`).
- Certificaciones: sección `certifications` (`title`, `org` = emisor, `dates`, `verify_url` = enlace de verificación).

### Foto

Copia la imagen en `assets/img/` (cuadrada, unos 640×640 px, JPEG) y cambia `photo` en `_data/profile.yml`. Déjalo vacío (`photo: ""`) para ocultarla.

### CV en PDF

Los PDF están en `assets/pdf/` y se enlazan desde `pdf.en` / `pdf.es` en `_data/profile.yml`; si se dejan vacíos, el botón «Descargar CV» desaparece. Se generan a partir de la hoja de estilos de impresión de la propia web, así que **después de cambiar el contenido hay que regenerarlos**:

1. Arranca el sitio en local y abre <http://localhost:4000/> en Chrome.
2. Imprimir (Cmd+P) → Destino: «Guardar como PDF» → Papel: A4 → Márgenes: predeterminados → activa «Gráficos de fondo».
3. Guarda el archivo como `assets/pdf/cv-jorge-neyra-araoz-en.pdf`.
4. Repite con <http://localhost:4000/es/> → `cv-jorge-neyra-araoz-es.pdf`.

### Imagen para redes sociales y favicon

- `assets/img/og.png` (1200×630): vista previa al compartir el enlace en LinkedIn, Slack, etc. Si cambias de puesto, sustitúyela por otra del mismo tamaño.
- `assets/img/favicon.svg` y `assets/img/apple-touch-icon.png`: icono «JN».

## Publicar en GitHub Pages

El despliegue lo hace el workflow `.github/workflows/pages.yml`: en cada `push` a `main` compila el sitio con Jekyll y lo publica. No uses a la vez el modo «Deploy from a branch».

1. Crea el repositorio en GitHub. Para que la web quede en `https://hneyra.github.io/`, el repositorio debe llamarse exactamente **`hneyra.github.io`** y pertenecer a la cuenta `hneyra`.
2. Sube el código:

   ```sh
   git add .
   git commit -m "CV online"
   git remote add origin git@github.com:hneyra/hneyra.github.io.git
   git push -u origin main
   ```

3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. En la pestaña **Actions**, espera a que termine «Deploy site to GitHub Pages» (puedes lanzarlo a mano con «Run workflow»). La URL aparece en el resumen del job `deploy`.

### `url` y `baseurl`

- **Sitio de usuario** (`usuario.github.io`): `url: "https://usuario.github.io"` y `baseurl: ""` en `_config.yml`.
- **Sitio de proyecto** (`usuario.github.io/repositorio/`): deja `baseurl: ""`; el workflow pasa automáticamente `--baseurl /repositorio` al compilar. Cambia `url` a `https://usuario.github.io`.

Todos los enlaces internos usan los filtros `relative_url` / `absolute_url`, así que funcionan en ambos casos.

### Dominio propio (opcional)

1. En tu proveedor DNS crea un registro `CNAME` `www` → `hneyra.github.io` (o registros `A`/`AAAA` para el dominio raíz, según la [documentación de GitHub](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. En **Settings → Pages → Custom domain** escribe el dominio y activa **Enforce HTTPS** cuando esté disponible. (Con GitHub Actions no hace falta un archivo `CNAME` en el repositorio.)
3. Cambia `url` en `_config.yml` al nuevo dominio, por ejemplo `url: "https://www.tudominio.com"`, y haz `push`.

## Estructura

```
_config.yml              Configuración de Jekyll (url, baseurl, Sass)
_data/profile.yml        Datos comunes (nombre, email, foto, PDF, enlaces)
_data/en.yml, es.yml     Textos y secciones del CV en cada idioma
_data/themes.yml         Temas del selector de color
_layouts/default.html    Estructura de la página (head, cabecera, pie)
_layouts/home.html       Página del CV (hero, perfil, secciones, contacto)
_includes/               Componentes: head, nav, hero, section, footer, iconos…
assets/css/main.scss     Estilos, temas claro/oscuro e impresión
assets/js/main.js        Selector de tema, modo oscuro y menú móvil (mejora progresiva)
assets/img/, assets/pdf/ Foto, iconos, imagen social y PDF del CV
index.md, es/index.md    Páginas en inglés y español
404.html                 Página de error
.github/workflows/       Despliegue en GitHub Pages
```
