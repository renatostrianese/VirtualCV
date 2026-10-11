# Renato Strianese · CV interactivo

Mundo isométrico 3D (Three.js) para descubrir mi perfil profesional. Bilingüe (ES/EN), con modo "CV rápido" para quien prefiere leerlo de corrido.

- **Moverse:** WASD / flechas, click/tap en el suelo, o joystick táctil en móvil.
- **Interactuar:** acércate a un edificio con aro brillante y pulsa `E` (o toca el botón / el edificio).
- **Coleccionar:** las esferas de colores son las tecnologías que uso.
- **Mapa:** el botón 🗺️ lista las zonas y te lleva caminando hasta ellas.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
npm run preview
```

## Editar contenido

Todo el contenido está en [`src/data.js`](src/data.js) (bilingüe `{ es, en }`). La foto es `public/photo.jpg`.
Posiciones y diseño de edificios: [`src/world.js`](src/world.js).

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube este proyecto a la rama `main`.
2. En **Settings → Pages**, elige **Source: GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` construye y publica en cada push a `main`.

El build usa `base: './'`, así que funciona tanto en `https://usuario.github.io/repo/` como en `https://usuario.github.io/` (repo `usuario.github.io`) o en un dominio propio.
