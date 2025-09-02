<template>
    <div class="menu-buttons">
      <router-link
        v-for="item in menuItems"
        :key="item.text"
        :to="item.route"
        class="menu-card"
      >
        <v-icon size="40">{{ item.icon }}</v-icon>
        <span>{{ item.text }}</span>
      </router-link>
    </div>
  </template>
  
  <script setup>
  const menuItems = [
    { text: 'Новая продажа', icon: 'mdi-cash-register', route: '/saleForm' },
    { text: 'Отчёты', icon: 'mdi-chart-bar', route: '/reports' },
    { text: 'Списания', icon: 'mdi-file-cancel', route: '/writeoff' },
    { text: 'Пункт меню', icon: 'mdi-food', route: '/menu' },
    { text: 'Ещё пункт', icon: 'mdi-dots-horizontal', route: '/more' },
    { text: 'Пункт бла', icon: 'mdi-information', route: '/info' },
    { text: 'Пункт меню', icon: 'mdi-food', route: '/menu' },
    { text: 'Ещё пункт', icon: 'mdi-dots-horizontal', route: '/more' },
  ];
  </script>
  
  <style scoped>
  
  .menu-card {
  background-color: 								 #99a6ec;
  color: white;
  border-radius: 16px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  font-size: 15px;
  padding: 5px;
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  background-color: #1E857F;
}

  
  .menu-card v-icon {
    margin-bottom: 8px;
  }
  .menu-buttons {
  display: grid;
  gap: 20px;
  padding: 20px;
  max-width: 640px;
  margin: 0 auto; /* Центрирование */
  margin-top: 50vh;
  transform: translateY(-50%);
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

@media (max-width: 600px) {
  .menu-buttons {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
  }
}

  </style>
  