<template>
    <input type="text" v-model="login">
    <input type="password" v-model="password">
    <button @click="auth">Войти</button>
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
            axios.post("http://localhost:3000/auth", {
                login: this.login,
                password: this.password
            })
                .then(res => {
                    const role = res.data.info.role

                    localStorage.setItem("role", role)

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
</style>
  