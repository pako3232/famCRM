<template>
    <div class="custom-multiselect">
      <div class="dropdown-toggle" @click="toggleDropdown">
        {{ selected ? selected.name + ' — ' + selected.price + '₽' : 'Выберите цветок' }}
        <span class="arrow" :class="{ open: isOpen }">▼</span>
      </div>
  
      <div class="dropdown" v-if="isOpen">
        <input
          type="text"
          v-model="search"
          placeholder="Поиск..."
          class="search-input"
        />
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          class="dropdown-item"
          @click="select(option)"
        >
          {{ option.name }} — {{ option.price }}₽
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      options: {
        type: Array,
        required: true
      },
      modelValue: {
        type: Object,
        default: null
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        isOpen: false,
        search: ''
      }
    },
    computed: {
      selected() {
        return this.modelValue
      },
      filteredOptions() {
        return this.options.filter(option =>
          option.name.toLowerCase().includes(this.search.toLowerCase())
        )
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },
      select(option) {
        this.$emit('update:modelValue', option)
        this.isOpen = false
        this.search = ''
      }
    }
  }
  </script>
  
  <style scoped>
  .custom-multiselect {
    position: relative;
    width: 100%;
    max-width: 300px;
    font-family: sans-serif;
  }
  .dropdown-toggle {
    padding: 10px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .arrow {
    transition: transform 0.2s ease;
  }
  .arrow.open {
    transform: rotate(180deg);
  }
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
  }
  .search-input {
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
  }
  .dropdown-item {
    padding: 10px;
    cursor: pointer;
  }
  .dropdown-item:hover {
    background-color: #f0f0f0;
  }
  </style>
  