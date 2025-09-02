<template>
  <v-autocomplete v-model="selected" :items="flowerOptions" item-value="id" :item-title="getFlowerLabel"
    :return-object="true" clearable density="comfortable" variant="outlined" placeholder="Выберите цветок">
    <!-- Кастомизация выпадающего пункта -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <v-list-item-title>{{ item.raw.name }} — {{ item.raw.price }}₽</v-list-item-title>
      </v-list-item>
    </template>

    <!-- Кастомизация выбранного значения -->
    <template v-slot:selection="{ item }">
      <span>{{ item.raw.name }} — {{ item.raw.price }}₽</span>
    </template>
  </v-autocomplete>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components: { Multiselect },
  data() {
    return {
      selected: null,
      flowerOptions: [
        { id: 1, name: 'Роза', price: 200 },
        { id: 2, name: 'Тюльпан', price: 100 },
        { id: 3, name: 'Гербера', price: 300 },
      ]

    }
  },
  methods: {
    getFlowerLabel(flower) {
      if (!flower) return ''
      return `${flower.name} — ${flower.price}₽`
    }
  }

}
</script>
