# HTML Semántico

El HTML semántico utiliza etiquetas que describen claramente el propósito del contenido para desarrolladores y agentes de usuario (como navegadores y lectores de pantalla). Usar etiquetas semánticas mejora la accesibilidad, el SEO y la mantenibilidad del código.

## Elementos principales

- `<header>`: Contenido introductorio o de navegación de una página o sección. Suele incluir logotipos, títulos y menús.

	Ejemplo:

	```html
	<header>
		<img src="/logo.svg" alt="Mi sitio">
		<nav><!-- enlaces --></nav>
	</header>
	```

- `<nav>`: Bloque de enlaces de navegación destinados a moverse por el sitio o por secciones importantes.

	Ejemplo:

	```html
	<nav aria-label="Navegación principal">
		<a href="/">Inicio</a>
		<a href="/sobre">Sobre nosotros</a>
	</nav>
	```

- `<main>`: Marca el contenido principal de la página. Debe usarse una sola vez por documento.

	Ejemplo:

	```html
	<main>
		<!-- contenido principal -->
	</main>
	```

- `<section>`: Agrupa contenido relacionado por tema. Úsalo cuando el contenido tenga su propio encabezado y pueda listarse en un índice.

	Ejemplo:

	```html
	<section>
		<h2>Características</h2>
		<p>Detalle de características.</p>
	</section>
	```

- `<article>`: Contenido independiente y autocontenido que puede redistribuirse por separado (por ejemplo, una entrada de blog, una noticia o una reseña).

	Ejemplo:

	```html
	<article>
		<h2>Título del artículo</h2>
		<p>Texto del artículo...</p>
	</article>
	```

- `<aside>`: Contenido complementario o tangencial al contenido principal, como barras laterales, enlaces relacionados o llamadas a la acción.

	Ejemplo:

	```html
	<aside aria-label="Enlaces relacionados">
		<h3>Relacionado</h3>
		<ul><li><a href="#">Artículo</a></li></ul>
	</aside>
	```

- `<footer>`: Pie de página de una página o sección. Contiene información de contacto, navegación secundaria o derechos de autor.

	Ejemplo:

	```html
	<footer>
		<p>&copy; 2025 Mi empresa</p>
	</footer>
	```

## Buenas prácticas

- Usa `<main>` una sola vez por página.
- Emplea encabezados (`<h1>`–`<h6>`) para estructurar el contenido dentro de `section` y `article`.
- No uses elementos semánticos solo por estilo; piensa en su propósito.
- Añade `aria-label` o roles cuando el propósito no sea claro o para mejorar la accesibilidad.

## Accesibilidad y SEO

- Los lectores de pantalla y motores de búsqueda usan las etiquetas semánticas para comprender la estructura del contenido; esto mejora la experiencia de navegación y el SEO.
- Usa atributos `alt` en imágenes y `aria-*` cuando sea necesario para describir controles o regiones.

## Resumen rápido

- `header`: introducción o navegación.
- `nav`: enlaces de navegación.
- `main`: contenido principal (solo 1 por página).
- `section`: grupo temático con encabezado.
- `article`: contenido independiente y reutilizable.
- `aside`: contenido complementario.
- `footer`: pie de página de sección o documento.

Para más detalles y ejemplos, prueba a inspeccionar la estructura de páginas bien formadas y prueba con un lector de pantalla para verificar la navegación por regiones.