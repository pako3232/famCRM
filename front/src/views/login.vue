<template>
    <v-container class="login-form">
        <h2 class="mb-5">Авторизация</h2>
        <v-text-field v-model="login" label="Имя" variant="outlined" color="customBlue" />
        <v-text-field type="password" v-model="password" label="Пароль" variant="outlined" color="customBlue" />
        <v-btn color="customBlue" class="w-100" @click="auth">Войти</v-btn>
    </v-container>
</template>
  
<script>
import axios from 'axios';



export default {
    data() {
        return {
            login: '',
            password: ''
        }
    },
    methods: {
        auth() {
            axios.post("http://192.168.0.179:3000/auth", {
                login: this.login,
                password: this.password
            })
                .then(res => {
                    const role = res.data.info.role
                    const username = res.data.info.login
                    const userID = res.data.info.id

                    localStorage.setItem("role", role)
                    localStorage.setItem("username", username)
                    localStorage.setItem("userID", userID)

                    if (role === 'admin') {
                        this.$router.push('/adminka');
                    } else if (role === 'florist') {
                        this.$router.push('/florist');
                    } else {
                        this.$router.push('/');
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style scoped>
input {
    display: block;
    margin: 10px;
}

.login-form {
    margin-top: 50vh;
    transform: translateY(-50%);
    padding: 20px;
    max-width: 500px;
}
</style>
  