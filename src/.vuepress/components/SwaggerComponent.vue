<template>
  <div id="swagger" class="swagger"></div>
</template>

<script>
import { SwaggerUIBundle } from 'swagger-ui-dist';

export default {
  mounted() {
    SwaggerUIBundle({
      url: 'https://v4.passwordless.dev/swagger/v4/swagger.json',
      defaultModelsExpandDepth: -1,
      showCommonExtensions: true,
      showExtensions: true,
      dom_id: '#swagger',
      supportedSubmitMethods: []
    });
  }
};
</script>

<style>
@import '../../../node_modules/swagger-ui-dist/swagger-ui.css';
@import '../public/openapi.css';

h2.title,
.info__tos,
.info__contact {
  display: none;
}

/* The default theme defines an unscoped `.arrow` class that paints a chevron as a
   1em background-image. Swagger UI marks its own inline SVG chevrons with
   class="arrow", so both get drawn — a second chevron behind each one, with the SVG
   stretched to 1em. Undo the theme's rule inside the embed; `auto` lets each SVG
   fall back to its own width/height attributes. */
.swagger-ui .arrow {
  width: auto;
  height: auto;
  background-image: none;
}

.page .theme-default-content {
  max-width: 100%;
}
</style>
