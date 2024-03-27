<template>
  <div id="swagger" class="swagger"></div>
</template>

<script>
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

export default {
  mounted() {
    SwaggerUI({
      url: 'https://v4.passwordless.dev/swagger/v4/swagger.json',
      defaultModelsExpandDepth: -1,
      showCommonExtensions: true,
      showExtensions: true,
      dom_id: '#swagger'
    });
  }
};
</script>

<style>
@import '../public/openapi.css';

h2.title,
.info__tos,
.info__contact {
  display: none;
}
</style>
