# Página personal · Juan Felipe Olivar Londoño

Portfolio profesional de turismo, ordenación territorial y SIG. Web estática (HTML, CSS y JavaScript sin dependencias) publicada con GitHub Pages.

Página en vivo: https://jfolivarl.github.io/

## Estructura
Todos los archivos van en la raíz, sin subcarpetas, para poder subirlos de una vez desde cualquier dispositivo.
- `index.html` — contenido de la página
- `style.css` — estilos (responsive, claro/oscuro automático)
- `main.js` — interacciones: carruseles, ventana de CV, filtros de proyectos, menú y botón «volver arriba»
- `cv-turismo.pdf`, `cv-territorio-sig.pdf` — CV con enlaces a LinkedIn, correo y web
- `cv-turismo.jpg`, `cv-territorio-sig.jpg` — miniaturas de los CV
- `favicon.svg`, `apple-touch-icon.png`, `icon-512.png` — iconos del logo JO (`icon-512.png` es la imagen al compartir)
- `logo.svg` — archivo original del logo (en la página va incrustado para seguir el modo claro/oscuro)

## Secciones
Portada · Lo que aporto (Turismo / Territorio y SIG) · Formación y experiencia · Proyectos · Herramientas · Contacto

## Portada
Los dos círculos (`.hecho` con `data-slide`) llevan a su área de «Lo que aporto». Sin JavaScript, el enlace `#acerca` sigue funcionando.

## Lo que aporto
En la sección `#acerca`, cada `<article class="slide">` es un área. Para añadir otra, copia un `article` y un botón `.car-tab` con su `data-i`.

## Formación y experiencia
Carrusel de dos fichas cuadradas desplegables (`#tray-track`). Avanza solo cada 6 s mientras ninguna está abierta y se para en cuanto el usuario lo toca. Al abrir una ficha se cierra la otra y la abierta se centra. En Experiencia, cada puesto (`details.job`) se despliega con sus tareas. Para añadir una entrada, copia un `<li>` de la lista correspondiente.

## Proyectos
Copia una tarjeta `.proy` dentro del grupo que corresponda. Un proyecto en mente lleva la clase `vacio` y la etiqueta `est`; al terminarlo, quita `vacio`, cambia la etiqueta a `est ok` («Realizado») y añade el botón `.btn-proy` con el enlace. El color sale de la variable `--area` de cada grupo.

## Currículums
El botón «Descargar CV» de la portada abre una ventana con un carrusel de los dos CV (`#cv-track`), que se desliza en horizontal. Desde cada área de «Lo que aporto» se abre directamente en su CV.

## Actualizar un CV
Sustituye el PDF manteniendo el nombre (y su miniatura `.jpg` si quieres).

## Publicación
Repositorio `jfolivarl.github.io`, rama `main`. GitHub Pages: Settings › Pages › rama `main`, carpeta `/ (root)`.
