<template>
    <v-container class="container">

        <div class="block1">

            <div class="new-flower-container">
                <h2 class="mb-2">Новая продажа</h2>
                <div v-for="(flower, index) in flowers" :key="index" class="new-flower">
                    <v-autocomplete style="flex: 16;" hide-details density="compact" class="custom-autocomplete"
                        :return-object="true" v-model="flower.selected" :items="flowerOptions"
                        :item-title="getFlowerLabel" placeholder="Выберите цветок">

                        <template v-slot:selection="{ item }">
                            <span>{{ item.raw.name }} — {{ item.raw.price }}₽</span>
                        </template>
                    </v-autocomplete>
                    <v-number-input style="flex: 9" controlVariant="split" v-model="flower.quantity"
                        @input="onPhoneInput" placeholder="Кол-во" hide-details density="compact"
                        class="custom-autocomplete custom-number-input">
                    </v-number-input>


                    <v-icon style="flex: 1;" @click="removeFlower(index)">mdi-close</v-icon>
                </div>

                <v-btn @click="addFlower" color="customBlue" class="w-100 " style="color: white !important">
                    Добавить цветок
                </v-btn>
            </div>

            <div class="package-container">
                <div class="package-check">
                    <p>Упаковка</p>
                    <input type="checkbox" v-model="packageEst" name="" id="">
                </div>

                <v-autocomplete v-if="packageEst" hide-details density="compact" class="custom-autocomplete mb-4"
                    :return-object="true" v-model="package" :items="packageOptions" :item-title="getPackageLabel"
                    placeholder="Выберите упаковку">
                </v-autocomplete>
            </div>

            <div class="bonus-container">
                <div class="bonus-check-container">
                    <p>Бонусная программа</p>
                    <v-text-field type="tel" v-model="formattedPhone" @input="onPhoneInput"
                        placeholder="+7 (___) ___-__-__" hide-details density="compact" class="custom-autocomplete ">
                    </v-text-field>

                    <v-btn @click="checkBonus" style="color: white !important" color="customBlue"
                        class="check-phone-number">Проверить
                        <v-progress-circular v-if="isCheckingBounus" class="ml-2 check-phone-number-loader"
                            indeterminate></v-progress-circular>
                    </v-btn>
                </div>
                <div class="" v-if="bonusButtonClick">
                    <div class="no-reg-container" v-if="clientBonus == null">
                        <p>Пользователь не зарегистрирован</p>
                        <v-btn color="customBlue">Зарегистрировать</v-btn>
                    </div>
                    <div class="bonus-menu" v-else>
                        <div>
                            <h3>Клиент: {{ clientName }}</h3>
                            <!-- <h3>Баланс: {{ clientBonus }}</h3> -->
                        </div>


                        <div class="bonus-menu-buttons">
                            <v-btn @click="nakopit" :class="{ 'bonus-active-button': activeBonsuButton == 'nakopit' }"
                                color="customBlue">Накопить {{ showBonus }}</v-btn>
                            <v-btn @click="spisat" :class="{ 'bonus-active-button': activeBonsuButton == 'spisat' }"
                                v-if="canUseBonus > 0" color="customBlue">Списать {{ canUseBonus }}</v-btn>
                            <v-btn v-else color="customBlue">Списывать нечего</v-btn>
                        </div>

                    </div>
                </div>
            </div>
            <div class="delivery-container mt-3">
                <div class="delivery-check">
                    <p>Доставка</p>
                    <input type="checkbox" v-model="delivery" name="" id="">
                    <v-text-field min="0" v-if="delivery" type="number" v-model="deliveryPrice"
                        placeholder="Стоимость доставки" hide-details density="compact" class="custom-autocomplete ">
                    </v-text-field>
                </div>

            </div>
            <div class="price-container">
                <h3>Стоимость: {{ fullPrice }}</h3>
                <h2>Итоговая стоимость: {{ discountedPrice }}</h2>
            </div>

            <v-btn @click="push" color="customBlue" class="w-100 mt-2" style="color: white !important">
                Зафиксировать продажу
            </v-btn>
        </div>

        <div class="block2">


        </div>
    </v-container>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

import axios from 'axios'
import { makeVThemeProviderProps } from 'vuetify/lib/components/VThemeProvider/VThemeProvider'
export default {
    components: {
        Multiselect
    },
    mounted() {
        axios.get('http://localhost:3000/getFlowers')
            .then(res => {
                this.flowerOptions = res.data.info
            })
            .catch(err => {
                console.log(err)
            })
        axios.get("http://localhost:3000/getPackages")
            .then(res => {
                this.packageOptions = res.data.info
                console.log(this.packageOptions)
            })
            .catch(err => {
                console.log(err)
            })
    },

    data() {
        return {
            flowers: [
                { selected: null, quantity: 1 }
            ],
            flowerOptions: [],
            package: '',
            packageEst: false,
            packageOptions: ['Крафт', 'Упаковка 2', 'Упаковка 3'],
            bonusButtonClick: false,
            activeBonsuButton: '',
            clientBonus: null,
            clientName: null,
            clientID: null,
            discount: null,
            bonus: null,
            phoneNumber: '',
            isCheckingBounus: false,
            delivery: false,
            deliveryPrice: null,
        }
    },
    methods: {
        consoll() {
            console.log(this.flowers)
        },
        addFlower() {
            this.flowers.push({
                selected: null,
                quantity: 1
            })
            console.log(this.flowers)
        },
        removeFlower(index) {
            this.flowers.splice(index, 1)
        },
        checkBonus() {
            this.isCheckingBounus = true
            this.activeBonsuButton = ''
            axios.post("http://localhost:3000/bonusCheck", {
                phoneNumber: this.phoneNumber
            })
                .then(res => {
                    this.clientBonus = Number(res.data.info.bonuses)
                    this.clientName = res.data.info.name,
                        this.clientID = res.data.info.id
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.bonusButtonClick = true
                    this.isCheckingBounus = false
                })

        },
        onPhoneInput(event) {
            const rawDigits = event.target.value.replace(/\D/g, '');
            this.phoneNumber = rawDigits;
        },

        getFlowerLabel(flower) {
            if (!flower) return ''
            return `${flower.name} — ${flower.price}₽`
        },
        getPackageLabel(pack) {
            if (!pack) return ''
            return `${pack.name} — ${pack.price}₽`
        },
        nakopit() {
            this.activeBonsuButton = 'nakopit'
            this.discount = null
            this.bonus = this.showBonus

        },
        spisat() {
            this.activeBonsuButton = 'spisat'
            this.discount = this.canUseBonus
            this.bonus = null
        },
        push() {
            console.log(this.flowers)
            axios.post("http://localhost:3000/pushSale", {
                flowers: this.flowers,
                package: this.package == '' ? null : this.package.id,
                discount: this.discount,
                bonus: this.bonus,
                deliveryPrice: this.deliveryPrice,
                fullPrice: this.fullPrice,
                discountedPrice: this.discountedPrice,
                date: new Date().toISOString().slice(0, 19).replace("T", " "),
                clientID: this.clientID,
                userID: localStorage.getItem("userID")

            })
        }
    },
    computed: {
        formattedPhone() {
            const digits = this.phoneNumber.replace(/\D/g, '').slice(0, 11);
            if (digits.length === 0) return '+7';
            let formatted = '+7';
            if (digits.length > 1) formatted += ` (${digits.slice(1, 4)}`;
            if (digits.length >= 4) formatted += `) ${digits.slice(4, 7)}`;
            if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
            if (digits.length >= 9) formatted += `-${digits.slice(9, 11)}`;
            return formatted;
        },
        fullPrice() {
            let total = 0
            total = this.flowers.reduce((sum, flower) => {
                if (!flower.selected || !flower.quantity) return sum;
                return sum + flower.selected.price * flower.quantity;
            }, 0);
            if (this.package != '' && this.packageEst) total += Number(this.package.price)
            if (this.deliveryPrice && this.delivery) total += Number(this.deliveryPrice)
            return total
        },
        discountedPrice() {
            return this.fullPrice - this.discount
            // return this.fullPrice
        },
        showBonus() {
            if (this.deliveryPrice) return Math.round((this.fullPrice - this.deliveryPrice) / 10)
            else return Math.round(this.fullPrice / 10)
        },
        canUseBonus() {

            return Math.round((this.fullPrice - this.deliveryPrice) / 100 * 30)
        }


    }
}
</script>

<style scoped>
.new-flower-container {}

.container {
    max-width: 640px;
}

.new-flower {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

::v-deep(.new-flower .custom-autocomplete) {
    flex-grow: 1;
    /* поле с выбором заполнит всё доступное пространство */
}

.flowers-count-input {
    display: block;
    max-width: 80px;
    height: 100%;
    border: 1px solid rgb(196, 196, 196);
    border-radius: 3px;
    padding: 9px 10px;
}

.package-check {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}

.package-container {
    margin-top: 10px;
}

.bonus-container {
    /* border: 2px solid #A5A8AD;
    padding: 10px;
    border-radius: 5px; */
}

.bonus-check-container {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.phone-number-input {
    display: block;
    height: 100%;
    border: 1px solid rgb(196, 196, 196);
    border-radius: 3px;
    padding: 5px;
}

.bonus-menu {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.bonus-menu-buttons {
    display: flex;
    gap: 10px;
}

.bonus-button {
    transition: .2s;
}

.bonus-active-button {
    background-color: #364183af !important;
}

.no-reg-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.delivery-check {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.delivery-price-input {
    display: block;
    height: 100%;
    border: 1px solid rgb(196, 196, 196);
    border-radius: 3px;
    padding: 5px;
}

.price-container {
    text-align: start;
}

.price-container h2 {
    color: #76ff03
}



::v-deep(.custom-autocomplete .v-field) {
    background-color: #242424;
    border: 1px solid #888;
    border-radius: 6px;
    color: #fff;
    padding: 2px 8px;
    min-height: 2px !important;
    /* уменьшает общую высоту */
}

::v-deep(.custom-autocomplete .v-field__input) {
    font-size: 14px;
    padding: 6px 0;
    color: #fff;
    min-height: 2px !important;
    /* уменьшает общую высоту */
    width: 100%;
}

::v-deep(.custom-autocomplete input::placeholder) {
    color: #bbb;
}

::v-deep(.custom-autocomplete .v-field__append-inner) {
    color: #ccc;
}

/* Выпадающий список */
::v-deep(.custom-autocomplete .v-overlay__content) {
    background-color: #242424;
    border: 1px solid #888;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    max-height: 200px;
    overflow-y: auto;
}

::v-deep(.custom-autocomplete .v-list) {
    background-color: transparent !important;
    padding: 0;
}

::v-deep(.custom-autocomplete .v-list-item) {
    color: #fff;
    transition: background-color 0.2s;
}

::v-deep(.custom-autocomplete .v-list-item:hover) {
    background-color: #333;
}

::v-deep(.custom-autocomplete .v-list-item--active) {
    background-color: #555 !important;
}

::v-deep(.custom-number-input .v-field__input) {
    /* max-width: 20px !important; */
}

::v-deep(.custom-number-input .v-field) {
    /* max-width: 130px !important; */
    justify-content: flex-end;
    margin-left: auto;
}


/* * {
  outline: 1px solid rgba(0, 0, 255, 0.2);
} */
</style>