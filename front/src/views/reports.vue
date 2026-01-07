<template>

   <div class="container">
      <h1 class="mb-2" style="color: white;">Отчеты</h1>

      <div class="reports-container">
         <div class="report-card" v-for="(sale, index) in sales">
            <div class="info">
               <h3>Продажа №{{ sale.id }}</h3>
               <p>Клиент: {{ sale.clientName || "Не зарегистрован" }}</p>
               <p>Скидка: {{ sale.discount || "0" }}₽</p>
               <p v-if="sale.deliveryPrice">Стоимость доставки: {{ sale.deliveryPrice }}₽</p>
               <p v-if="sale.packageName">Упаковка: {{ sale.packageName }} - {{ sale.packagePrice }}₽</p>
               <h4>Стоимость: {{ sale.price }}₽</h4>
               <h4>Итоговая стоимость: <span style="color: #76ff03">{{ sale.discountedPrice }}</span>₽</h4>
               <p style="color: gray;">Флорист: {{ sale.florist }}</p>
               <p style="color: gray;">Дата: {{ sale.date }}</p>
            </div>
            <div class="flowers-conatiner">
               <h3>Товары: </h3>
               <div class="flowers">
                  <div v-for="flower in sale.flowers" class="flower">
                     <p>{{ flower.name }}</p>
                     <img class="flower-img" src="../../img/zaglushka.png" alt="">
                     <p>{{ flower.price }}₽ x{{ flower.quantity }}</p>
                  </div>
               </div>

            </div>
         </div>
      </div>

   </div>



</template>

<script>
import axios from 'axios'
export default {
   data() {
      return {
         sales: null
      }

   },
   mounted() {
      axios.get("http://localhost:3000/getAll")
         .then(res => {
            console.log(res.data.sales)

            this.sales = res.data.sales
         })
         .catch(err => {
            console.log(err)
         })
   }

}


</script>

<style scoped>
.container {
   padding: 20px;
}

.reports-container {
   margin-top: 20px;
}

.report-card {
   display: flex;
   text-align: start;
   padding: 10px;
   border: 1px solid gray;
   border-radius: 5px;
   /* flex-basis: 48%; */
   margin-bottom: 10px;
}

.info {
   flex-basis: 50%;
}

.flowers {
   display: flex;
   gap: 5px;
   margin-top: 5px;
   flex-wrap: wrap;
   flex-basis: 50%;
}

.flower {
   border: 1px solid gray;
   border-radius: 5px;
   padding: 2px 10px;
   text-align: center;
   /* aspect-ratio: 1 / 1; */
   height: fit-content;
}

.flower-img {
   max-width: 50px;
   border-radius: 5px;
   margin-top: 5px;
}
</style>
