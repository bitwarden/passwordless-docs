<template>
  <div id="swagger" class="swagger"></div>
</template>

<script>
import {SwaggerUIBundle} from "swagger-ui-dist";

export default {
  mounted() {
    SwaggerUIBundle({
      url: 'https://localhost:7002/swagger/v4/swagger.json',
      defaultModelsExpandDepth: -1,
      showCommonExtensions: true,
      showExtensions: true,
      dom_id: '#swagger'
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
</style>
