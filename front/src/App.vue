<template>
  <div id="app">
    <router-view /> <!-- Здесь будут отображаться компоненты для каждого маршрута -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App'
};
</script>
